import mongoose, { Types } from "mongoose";
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import Shipments from "./shipment.model";

const IMPORT_REQUIRED_FIELDS = [
    "reference",
    "receiver_name",
    "country",
    "delivery_service",
    "city",
    "customer_address",
    "customer_email",
    "contact_number",
    "cod_amount",
    "branded_items",
    "goods_description",
    "insurance",
    "reforward_shipment",
    "warehousing_location",
    "user_id"
] as const;

const CSV_HEADER_ALIASES: Record<string, string> = {
    whatsapp_number: "whatsApp_number",
    whatsapp_numt: "whatsApp_number",
    whatsapp_num: "whatsApp_number",
    customer_addre: "customer_address",
    national_addres: "national_address",
    location_coordin: "location_coordinates",
    location_coordi: "location_coordinates",
    location_coord: "location_coordinates",
    customer_emai: "customer_email",
    goods_descriptic: "goods_description",
    reforward_shipm: "reforward_shipment",
    warehousing_loc: "warehousing_location",
    country_currenc: "country_currency",
};

function normalizeHeader(value: string): string {
    const normalized = String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
    return CSV_HEADER_ALIASES[normalized] || normalized;
}

async function getNextShipmentNumber(countryCodeRaw: string): Promise<string> {
    const countryCode = String(countryCodeRaw || "").trim().toUpperCase() || "WH";
    const lastShipment = await Shipments
        .findOne({ shipment_no: { $regex: `^${countryCode}-\\d+$` } })
        .sort({ created_at: -1 });

    let nextNumber = 1;
    if (lastShipment?.shipment_no) {
        const match = lastShipment.shipment_no.match(/-(\d+)$/);
        if (match) {
            nextNumber = parseInt(match[1], 10) + 1;
        }
    }

    return `${countryCode}-0${nextNumber}`;
}

function parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === "\"") {
            if (inQuotes && nextChar === "\"") {
                current += "\"";
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === "," && !inQuotes) {
            result.push(current.trim());
            current = "";
            continue;
        }

        current += char;
    }

    result.push(current.trim());
    return result;
}

function parseCsv(buffer: Buffer): Array<Record<string, string>> {
    const content = buffer.toString("utf-8").replace(/^\uFEFF/, "");
    const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length < 2) {
        return [];
    }

    const headers = parseCsvLine(lines[0]).map(normalizeHeader);
    const rows: Array<Record<string, string>> = [];

    for (let i = 1; i < lines.length; i += 1) {
        const values = parseCsvLine(lines[i]);
        if (values.every((v) => String(v).trim() === "")) {
            continue;
        }

        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
            row[header] = (values[index] || "").trim();
        });
        rows.push(row);
    }

    return rows;
}

// Validation function for shipment fields
function validateShipmentFields(body: any, type: "create" | "update" = "create") {
    const {
        user_id, reference, receiver_name, country, delivery_service, city, customer_address, national_address, location_coordinates, customer_email,
        contact_number, whatsApp_number, cod_amount, branded_items, custom_duty, goods_description, insurance, reforward_shipment, warehousing_location,
    } = body;

    // If type is "create", require user_id. If "update", ignore user_id validation.
    if (
        (type === "create" && (!user_id || typeof user_id !== "string" || user_id.trim() === "")) ||
        !reference || typeof reference !== "string" || reference.trim() === "" ||
        !receiver_name || typeof receiver_name !== "string" || receiver_name.trim() === "" ||
        !country || typeof country !== "string" || country.trim() === "" ||
        !delivery_service || typeof delivery_service !== "string" || delivery_service.trim() === "" ||
        !city || typeof city !== "string" || city.trim() === "" ||
        !customer_address || typeof customer_address !== "string" || customer_address.trim() === "" ||
        !customer_email || typeof customer_email !== "string" || customer_email.trim() === "" ||
        !contact_number || typeof contact_number !== "string" || contact_number.trim() === "" ||
        (cod_amount === undefined || cod_amount === null || cod_amount === "" ) ||
        (branded_items === undefined || branded_items === null || branded_items === "" ) ||
        !goods_description || typeof goods_description !== "string" || goods_description.trim() === "" ||
        (insurance === undefined || insurance === null || insurance === "" ) ||
        (reforward_shipment === undefined || reforward_shipment === null || reforward_shipment === "" ) ||
        !warehousing_location || typeof warehousing_location !== "string" || warehousing_location.trim() === ""
    ) {
        return false;
    }
    return true;
};

// POST / CREATE shipment
export const createShipment = asyncHandler(async (req: Request, res: Response) => {
    if (!validateShipmentFields(req.body, "create")) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "All fields (user_id, reference, receiver_name, country, delivery_service, city, customer_address, customer_email, contact_number, cod_amount, branded_items, goods_description, insurance, reforward_shipment, warehousing_location) are required and must not be blank",
        });
    }

    try {
        let { country_code } = req.body;
        let countryCode = country_code;

        console.log("req.body ====> ", req.body);

        // Generate new shipment number with country code and auto-incremented sequence
        // Find the last shipment for this country code
        let lastShipment = await Shipments
            .findOne({ shipment_no: { $regex: `^${countryCode}-\\d+$` } })
            .sort({ created_at: -1 });

        let nextNumber = 1;
        if (lastShipment && lastShipment.shipment_no) {
            // Extract the numeric part from shipment_no e.g., AE-3 => 3
            const match = lastShipment.shipment_no.match(/-(\d+)$/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }
        const shipment_no = `${countryCode}-0${nextNumber}`;
        
        const data = {...req.body, shipment_no};
        const newShipment = new Shipments(data);
        const savedShipment = await newShipment.save();
    
        res.status(200).json({
            code: 200,
            status: true, 
            message: "Shipment added successfully", 
            data: savedShipment
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Shipment added failed",
        });
    }
});

// PUT (update) shipment by ID
export const updateShipment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const data = { ...req.body, updated_at: new Date()}
        const updatedShipment = await Shipments.findByIdAndUpdate(
            id, data,
            { new: true, runValidators: true }
        );

        if (!updatedShipment) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Shipment not found",
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Shipment updated successfully",
            data: updatedShipment,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to update Shipment",
        });
    }
});

// PUT (update) shipment status by ID
export const updateShipmentStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedShipment = await Shipments.findByIdAndUpdate(
            id,
            { status: status?.toLowerCase() },
            { new: true, runValidators: true }
        );

        if (!updatedShipment) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Shipment not found",
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Shipment status updated successfully",
            data: updatedShipment,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to update shipment status",
        });
    }
});

// POST (fetch) all shipments (admin/user use-case) with pagination
export const getAllShipments = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { user_type, user_id, page = 1, limit = 10 } = req.body;

        const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 10));
        const skip = (pageNum - 1) * limitNum;

        let query: { user_id?: string } = {};
        if (user_type === "admin") {
            // no filter for admin
        } else if (user_type === "user") {
            if (!user_id) {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: "User ID not found in request",
                });
            }
            query = { user_id };
        } else {
            return res.status(403).json({
                code: 403,
                status: false,
                message: "Unauthorized access, invalid User Type or User ID",
            });
        }

        const [shipments, total] = await Promise.all([
            Shipments.find(query).sort({ created_at: -1 }).skip(skip).limit(limitNum).lean(),
            Shipments.countDocuments(query),
        ]);

        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            code: 200,
            status: true,
            message: "Shipments fetched successfully",
            data: shipments,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch shipments",
        });
    }
});

// GET single shipment by ID
export const getSingleShipment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
        const shipment = await Shipments.findById(id);
        
        if (!shipment) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Shipment not found",
            });
        }
    
        res.status(200).json({
            code: 200,
            status: true,
            message: "Shipment fetched successfully",
            data: shipment,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch shipment",
        });
    }
});

// DELETE single shipment by ID
export const deleteShipment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedShipment = await Shipments.findByIdAndDelete(id);

        if (!deletedShipment) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Shipment not found",
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Shipment deleted successfully",
            // data: deletedShipment,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to delete shipment",
        });
    }
});

// GET only "pending" status shipments by shipment ref, contact number or customer name with admin/user access control
export const searchShipment = asyncHandler(async (req: Request, res: Response) => {
    const {
        reference_number,
        receiver_name,
        contact_number,
        shipment_no,
        user_type,
        user_id,
    } = req.body;
  
    try {
        const query: any = {};

        // Always restrict to "pending" status
        query.status = { $regex: "^pending$", $options: "i" };

        // 🔍 Build search condition (case-insensitive)
        if (reference_number) {
            query.reference = { $regex: reference_number, $options: "i" };
        } else if (receiver_name) {
            query.receiver_name = { $regex: receiver_name, $options: "i" };
        } else if (contact_number) {
            query.contact_number = { $regex: contact_number, $options: "i" };
        } else if (shipment_no) {
            query.shipment_no = { $regex: shipment_no, $options: "i" };
        } else {
            // If no search field provided, return error
            return res.status(400).json({
                code: 400,
                status: false,
                message: "Please provide reference number, receiver name, contact number, or shipment number",
            });
        }
    
        // 🔐 User access control
        if (user_type === "admin") {
            // Admin can access all shipments
        } else if (user_type === "user" && user_id) {
            query.user_id = user_id;
        } else {
            return res.status(403).json({
                code: 403,
                status: false,
                message: "Unauthorized access, invalid User Type or User ID",
            });
        }

        // 📦 Fetch shipments (only where status is "pending")
        const shipments = await Shipments.find(query).lean();

        if (!shipments.length) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "No pending shipments found",
            });
        }
    
        return res.status(200).json({
            code: 200,
            status: true,
            message: "Pending shipments fetched successfully",
            data: shipments,
        });
    } catch (error) {
        console.error("Search shipment error:", error);
        return res.status(500).json({
            code: 500,
            status: false,
            message: "Internal server error",
        });
    }
});

// GET all shipments by shipment ref, contact number or customer name with admin/user access control
export const searchShipmentByStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status, user_type, user_id } = req.body;

    try {
        // Build base query depending on user user_type
        let query: { status?: string; user_id?: string } = {};

        // Apply search criteria
        if (status) {
            query.status = status;
        } else {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "Please provide status.",
            });
        }

        // User access control
        if (user_type === "admin") {
            // Admin can fetch all
            // Don't modify query
        } else if (user_type === "user" && user_id) {
            // users can only fetch their own shipments
            query.user_id = user_id;
        } else {
            return res.status(403).json({
                code: 403,
                status: false,
                message: "Unauthorized access, invalid User Type or User ID",
            });
        }

        // Limit to last 5 shipments, sorted by created_at descending
        const shipments = await Shipments.find(query)
            .sort({ created_at: -1 })
            .limit(5);

        if (!shipments || shipments.length === 0) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "No shipments found matching the provided criteria",
            });
        }
    
        res.status(200).json({
            code: 200,
            status: true,
            message: "Shipments fetched successfully",
            data: shipments,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch shipments",
        });
    }
});

// GET only "pending" status shipments within a given date range (start_date and end_date) with admin/user access control
export const searchShipmentByDate = asyncHandler(async (req: Request, res: Response) => {
    const { start_date, end_date, user_type, user_id } = req.body;

    if (!start_date || !end_date) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "Please provide both start_date and end_date",
        });
    }

    try {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Include full last day
        endDate.setHours(23, 59, 59, 999);

        // Always filter for "pending" status
        let query: any = {
            created_at: {
                $gte: startDate,
                $lte: endDate,
            },
            status: "pending"
        };

        if (user_type === "admin") {
            // Admin can see all pending shipments within date range
        } else if (user_type === "user" && user_id) {
            query.user_id = user_id;
        } else {
            return res.status(403).json({
                code: 403,
                status: false,
                message: "Unauthorized access, invalid User Type or User ID",
            });
        }

        const shipments = await Shipments.find(query);

        if (!shipments || shipments.length === 0) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "No pending shipments found in the provided date range",
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Pending shipments fetched successfully",
            data: shipments,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch pending shipments by date",
        });
    }
});

// Returns counts by status, top cities, top countries, and delivered shipment summary for analytics dashboard
export const shipmentStatusCounts = asyncHandler(async (req: Request, res: Response) => {
    const statusList = [
        "delivered",
        "in_transit",
        "no_answer",
        "out_for_delivery",
        "product_destroyed",
        "ready_for_return",
        "return_in_transit",
        "returned_to_client",
        "shipment_on_hold",
        "returned_to_inventory",
        "lost_shipments",
        "damaged_shipments",
        "pending",
    ];  

    const { user_type, user_id } = req.body;

    let matchQuery: any = {};

    if (user_type === "admin") {
        // admin → no filter
    } else if (user_type === "user") {
        if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "Invalid or missing user ID",
            });
        }
        matchQuery.user_id = new mongoose.Types.ObjectId(user_id);
    } else {
        return res.status(403).json({
            code: 403,
            status: false,
            message: "Unauthorized access, invalid User Type or User ID",
        });
    }

    try {
        /* =========================
           STATUS COUNTS
        ========================= */
        const statusPipeline: any[] = [];
        if (Object.keys(matchQuery).length) {
            statusPipeline.push({ $match: matchQuery });
        }

        statusPipeline.push({
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        });

        const statusCounts = await Shipments.aggregate(statusPipeline);

        const statusMap: Record<string, number> = {};
        statusCounts.forEach(item => {
            statusMap[item._id] = item.count;
        });

        const statusResult: Record<string, number> = {};
        statusList.forEach(status => {
            statusResult[status] = statusMap[status] || 0;
        });

        /* =========================
           CITY-WISE COUNTS
        ========================= */
        const cityPipeline: any[] = [];
        if (Object.keys(matchQuery).length) {
            cityPipeline.push({ $match: matchQuery });
        }
        cityPipeline.push(
            {
                $project: {
                city: {
                    $trim: {
                    input: { $toLower: "$city" }
                    }
                }
                }
            },
            {
                $group: {
                _id: "$city",
                shipments: { $sum: 1 }
                }
            },
            {
                $project: {
                _id: 0,
                city: {
                    $concat: [
                    { $toUpper: { $substrCP: ["$_id", 0, 1] } },
                    { $substrCP: ["$_id", 1, { $strLenCP: "$_id" }] }
                    ]
                },
                shipments: 1
                }
            },
            {
                $sort: { shipments: -1 }
            },
            {
                $limit: 5
            }
        );
        const cityWiseCounts = await Shipments.aggregate(cityPipeline);

        
         /* =========================
           COUNTRY-WISE COUNTS
        ========================= */
        const countryPipeline: any[] = [];
        if (Object.keys(matchQuery).length) {
            countryPipeline.push({ $match: matchQuery });
        }

        countryPipeline.push(
            {
                $project: {
                    country: {
                        $trim: {
                            input: { $toLower: "$country" }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$country",
                    shipments: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    country: {
                        $concat: [
                            { $toUpper: { $substrCP: ["$_id", 0, 1] } },
                            { $substrCP: ["$_id", 1, { $strLenCP: "$_id" }] }
                        ]
                    },
                    shipments: 1
                }
            },
            {
                $sort: { shipments: -1 }
            },
            {
                $limit: 5
            }
        );

        const countryWiseCounts = await Shipments.aggregate(countryPipeline);


        /* =========================
           DATE RANGES
        ========================= */
        const now = new Date();

        const startOfToday = new Date(now.setHours(0, 0, 0, 0));

        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);

        const dateField = "created_at"; // or "delivered_at" if you prefer

        const DELIVERED_STATUS = "delivered";

        /* =========================
                QUERY BUILDER
        ========================= */
        const buildDateQuery = (startDate: Date) => ({
            ...matchQuery,
            status: DELIVERED_STATUS, // 👈 status check added
            [dateField]: { $gte: startDate },
        });

        /* =========================
                COUNTS
        ========================= */
        const [
            shippedToday,
            shippedThisWeek,
            shippedThisMonth,
            shippedThisYear,
        ] = await Promise.all([
            Shipments.countDocuments(buildDateQuery(startOfToday)),
            Shipments.countDocuments(buildDateQuery(startOfWeek)),
            Shipments.countDocuments(buildDateQuery(startOfMonth)),
            Shipments.countDocuments(buildDateQuery(startOfYear)),
        ]);


        /* =========================
           TOTAL SHIPMENTS
        ========================= */
        const totalShipments = Object.keys(matchQuery).length
            ? await Shipments.countDocuments(matchQuery)
            : await Shipments.estimatedDocumentCount();

        res.status(200).json({
            code: 200,
            status: true,
            message: "Shipment analytics fetched successfully",
            data: {
                status_counts: {
                    ...statusResult,
                    all_shipments: totalShipments,
                },
                city_wise_counts: cityWiseCounts,
                country_wise_counts: countryWiseCounts,
                shipped_summary: {
                    today: shippedToday,
                    this_week: shippedThisWeek,
                    this_month: shippedThisMonth,
                    this_year: shippedThisYear,
                },
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch shipment analytics",
        });
    }
});

// Find daily Shipments API
export const findDailyShipments = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { user_type, user_id, date } = req.body;

        // Parse the date; default to today if not provided
        let queryDate: Date;
        if (date) {
            queryDate = new Date(date);
            if (isNaN(queryDate.getTime())) {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: "Invalid date format",
                });
            }
        } else {
            queryDate = new Date();
        }

        // Get start and end of the day
        const startOfDay = new Date(queryDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(queryDate);
        endOfDay.setHours(23, 59, 59, 999);

        let query: any = {
            created_at: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        };

        if (user_type === "admin") {
            // Admin can search for all Shipments
        } else if (user_type === "user" && user_id) {
            query.user_id = user_id;
        } else {
            return res.status(403).json({
                code: 403,
                status: false,
                message: "Unauthorized access, invalid User Type or User ID",
            });
        }

        const dailyShipments = await Shipments.find(query);

        res.status(200).json({
            code: 200,
            status: true,
            message: "Daily shipments fetched successfully",
            data: dailyShipments,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch daily shipments",
        });
    }
});

// API to fetch shipment summary and list in date range, filtered by user and/or country (for dashboard)
export const getShipmentSummary = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { from_date, to_date, country, user_id, user_type } = req.body;

        // Validate required fields
        if (!from_date || !to_date) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "from date and To date are required",
            });
        }

        // Parse dates
        const fromDateObj = new Date(from_date);
        const toDateObj = new Date(to_date);

        // Check date validity
        if (isNaN(fromDateObj.getTime()) || isNaN(toDateObj.getTime())) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "Invalid date(s) provided",
            });
        }

        // Set toDateObj to end of day
        toDateObj.setHours(23, 59, 59, 999);

        let query: any = {
            created_at: {
                $gte: fromDateObj,
                $lte: toDateObj,
            }
        };

        if (user_type === "admin") {
            if (user_id && Types.ObjectId.isValid(user_id)) {
                query.user_id = new Types.ObjectId(user_id);
            }
        } else if (user_type === "user") {
            if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: "Invalid or missing user ID",
                });
            }
            query.user_id = new Types.ObjectId(user_id);
        } else {
            return res.status(403).json({
                code: 403,
                status: false,
                message: "Unauthorized access, invalid User Type or User ID",
            });
        }

        // Optional filters
        const hasCountryFilter = country && country.trim() !== "";
        if (hasCountryFilter) {
            // Use regex for searching country (case-insensitive, partial match)
            query.country = { $regex: country.trim(), $options: "i" };
        }

        // Fetch shipments and build summary based on country filter
        const shipments = await Shipments.find(query);

        if (hasCountryFilter) {
            // Country-wise ratio: regex filter applied, return single country object
            const countryWisePipeline = [
                { $match: query },
                {
                    $group: {
                        _id: null,
                        country: { $first: "$country" },
                        total: { $sum: 1 },
                        delivered: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        country: 1,
                        total: 1,
                        delivered: 1,
                        delivery_ratio: {
                            $concat: [
                                {
                                    $cond: [
                                        { $gt: ["$total", 0] },
                                        {
                                            $toString: {
                                                $round: [{ $multiply: [{ $divide: ["$delivered", "$total"] }, 100] }, 0],
                                            },
                                        },
                                        "0",
                                    ],
                                },
                                "%",
                            ],
                        },
                    },
                },
            ];
            const countryResult = await Shipments.aggregate(countryWisePipeline);
            const countryWiseSummary =
                countryResult.length > 0
                    ? countryResult[0]
                    : { country: country.trim(), total: 0, delivered: 0, delivery_ratio: "0%" };

            return res.status(200).json({
                code: 200,
                status: true,
                message: "Shipment summary fetched successfully",
                summary: {
                    total_orders: countryWiseSummary.total,
                    delivered: countryWiseSummary.delivered,
                    delivery_rate: countryWiseSummary.delivery_ratio,
                    country_wise: countryWiseSummary,
                },
                data: shipments,
            });
        } else {
            // Status-wise ratio: group by status, delivery ratio = delivered / total
            const statusWisePipeline = [
                { $match: query },
                { $group: { _id: "$status", count: { $sum: 1 } } },
                { $sort: { count: -1 as const } },
            ];
            const statusCounts = await Shipments.aggregate(statusWisePipeline);
            const statusWiseSummary: Record<string, number> = {};
            let totalCount = 0;
            statusCounts.forEach((s) => {
                statusWiseSummary[s._id] = s.count;
                totalCount += s.count;
            });
            const deliveredCount = statusWiseSummary["delivered"] || 0;
            const deliveryRatio = totalCount > 0 ? Math.round((deliveredCount / totalCount) * 100) + "%" : "0%";

            return res.status(200).json({
                code: 200,
                status: true,
                message: "Shipment summary fetched successfully",
                summary: {
                    total_orders: totalCount,
                    status_wise: statusWiseSummary,
                    delivery_ratio: deliveryRatio,
                },
                data: shipments,
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch shipment summary",
        });
    }
});

// API: POST /filter-shipments
// Filters: from_date, to_date, updated_at, status (all optional), user_type, user_id
export const filterShipmentsByDatesAndStatus = asyncHandler(async (req: Request, res: Response) => {
    try {
        const {
            from_date,
            to_date,
            updated_at,
            status,
            user_type,
            user_id
        } = req.body;

        let query: any = {};

        if (user_type === "admin") {
            // admins can see all shipments
        } else if (user_type === "user" && user_id && Types.ObjectId.isValid(user_id)) {
            query.user_id = new Types.ObjectId(user_id);
        } else {
            return res.status(403).json({
                code: 403,
                status: false,
                message: "Unauthorized access, invalid User Type or User ID"
            });
        }

        // Filter by 'created_at' (requested from/to date)
        if (from_date || to_date) {
            query.created_at = {};
            if (from_date) {
                const from = new Date(from_date);
                query.created_at.$gte = from;
            }
            if (to_date) {
                // Include the whole day in 'to' date
                const to = new Date(to_date);
                to.setHours(23,59,59,999);
                query.created_at.$lte = to;
            }
        }

        // Filter by 'updated_at'
        if (updated_at) {
            // If only a single day, match that whole day
            const updatedDate = new Date(updated_at);
            let nextDay = new Date(updatedDate);
            nextDay.setHours(23, 59, 59, 999);

            query.updated_at = {
                $gte: updatedDate,
                $lte: nextDay
            };
        }

        // Filter by status
        if (status && status !== "Select Status" && status.trim() !== "") {
            query.status = status.trim();
        }

        // Get filtered shipments
        const shipments = await Shipments.find(query).sort({ created_at: -1 });

        return res.status(200).json({
            code: 200,
            status: true,
            message: "Shipments fetched successfully",
            data: shipments
        });
    } catch (err) {
        console.error("Filter shipments error:", err);
        return res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch shipments for the given filters"
        });
    }
});

// POST / IMPORT warehouse shipments from CSV
export const importWarehouseShipments = asyncHandler(async (req: Request, res: Response) => {
    try {
        const uploadedFile = (req as Request & { file?: Express.Multer.File }).file;

        if (!uploadedFile) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "CSV file is required in 'file' field",
            });
        }

        if (!uploadedFile.originalname.toLowerCase().endsWith(".csv")) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "Only CSV files are allowed",
            });
        }

        const rows = parseCsv(uploadedFile.buffer);
        if (!rows.length) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "CSV file is empty or has no data rows",
            });
        }

        const preparedDocs: Array<{ rowNumber: number; doc: Record<string, unknown> }> = [];
        const errors: Array<{ row: number; message: string }> = [];
        const fallbackUserId = String((req.body?.user_id as string) || "").trim();

        for (let index = 0; index < rows.length; index += 1) {
            const row = rows[index];
            const rowNumber = index + 2;

            const missingFields = IMPORT_REQUIRED_FIELDS.filter((field) => {
                const value = row[field];
                return value === undefined || value === null || String(value).trim() === "";
            });

            if (missingFields.length) {
                errors.push({
                    row: rowNumber,
                    message: `Missing required fields: ${missingFields.join(", ")}`,
                });
                continue;
            }

            const resolvedUserId = String(row.user_id || fallbackUserId || "").trim();
            if (!Types.ObjectId.isValid(resolvedUserId)) {
                errors.push({
                    row: rowNumber,
                    message: "Invalid ObjectId in user_id (provide in CSV or form-data user_id)",
                });
                continue;
            }

            const countryId =
                row.country_id && row.country_id.trim() !== ""
                    ? Types.ObjectId.isValid(row.country_id)
                        ? new Types.ObjectId(row.country_id)
                        : null
                    : undefined;

            const deliveryServiceId =
                row.delivery_service_id && row.delivery_service_id.trim() !== ""
                    ? Types.ObjectId.isValid(row.delivery_service_id)
                        ? new Types.ObjectId(row.delivery_service_id)
                        : null
                    : undefined;

            const cityId =
                row.city_id && row.city_id.trim() !== ""
                    ? Types.ObjectId.isValid(row.city_id)
                        ? new Types.ObjectId(row.city_id)
                        : null
                    : undefined;

            if (countryId === null || deliveryServiceId === null || cityId === null) {
                errors.push({
                    row: rowNumber,
                    message: "Invalid ObjectId in optional field: country_id, delivery_service_id or city_id",
                });
                continue;
            }

            const shipmentNo =
                row.shipment_no && row.shipment_no.trim() !== ""
                    ? row.shipment_no.trim()
                    : await getNextShipmentNumber(row.country_code || "WH");

            preparedDocs.push({
                rowNumber,
                doc: {
                    ...row,
                    shipment_no: shipmentNo,
                    status: row.status && row.status.trim() !== "" ? row.status : "pending",
                    user_id: new Types.ObjectId(resolvedUserId),
                    ...(countryId ? { country_id: countryId } : {}),
                    ...(deliveryServiceId ? { delivery_service_id: deliveryServiceId } : {}),
                    ...(cityId ? { city_id: cityId } : {}),
                }
            });
        }

        if (!preparedDocs.length) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "No valid shipment rows found in CSV",
                errors,
            });
        }

        let importedCount = 0;
        const saveResults = await Promise.allSettled(
            preparedDocs.map((item) => Shipments.create(item.doc))
        );
        saveResults.forEach((result, index) => {
            if (result.status === "fulfilled") {
                importedCount += 1;
            } else {
                errors.push({
                    row: preparedDocs[index].rowNumber,
                    message: result.reason?.message || "Failed to save shipment row",
                });
            }
        });

        return res.status(200).json({
            code: 200,
            status: importedCount > 0,
            message: importedCount > 0 ? "Warehouse shipments imported" : "No rows were imported",
            data: {
                imported_count: importedCount,
                failed_count: errors.length,
                errors,
            },
        });
    } catch (err) {
        console.error("Import warehouse shipments error:", err);
        return res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to import warehouse shipments",
        });
    }
});