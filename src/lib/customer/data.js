const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const field = {
  string: (options = {}) => ({
    kind: "string",
    defaultValue: options.defaultValue ?? "",
    enum: options.enum,
    maxLength: options.maxLength ?? 500,
  }),
  number: (options = {}) => ({
    kind: "number",
    defaultValue: options.defaultValue ?? 0,
    allowEmpty: options.allowEmpty ?? false,
    integer: options.integer ?? false,
    min: options.min,
    max: options.max,
  }),
  date: (options = {}) => ({
    kind: "date",
    defaultValue: options.defaultValue ?? "",
  }),
  object: (shape) => ({
    kind: "object",
    shape,
  }),
  array: (itemSchema, options = {}) => ({
    kind: "array",
    itemSchema,
    defaultValue: options.defaultValue ?? [],
    maxLength: options.maxLength ?? 50,
  }),
};

const customerSchema = field.object({
  date: field.date(),
  expectedDeliveryDate: field.date(),
  partyName: field.string({ maxLength: 160 }),
  address: field.string({ maxLength: 500 }),
  mobile: field.string({ maxLength: 20 }),
  email: field.string({ maxLength: 200 }),
  gstNo: field.string({ maxLength: 40 }),
  company: field.string({ enum: ["apw", "sre"], defaultValue: "apw", maxLength: 10 }),
  billNumber: field.string({ maxLength: 40 }),
  totalAmount: field.number({ defaultValue: 0, min: 0 }),
  advance: field.number({ defaultValue: 0, min: 0 }),
  isCompleted: field.string({
    enum: ["progress", "completed", "canceled"],
    defaultValue: "progress",
    maxLength: 20,
  }),
  mediaCount: field.number({ defaultValue: 1, min: 0, max: 50, integer: true }),
  mediaDetails: field.array(
    field.object({
      type: field.string({ maxLength: 100 }),
      rate: field.string({ maxLength: 100 }),
      size: field.string({ maxLength: 100 }),
    }),
    { maxLength: 50 },
  ),
  fileDetails: field.object({
    pc: field.string({ enum: ["1", "2", "3"], defaultValue: "1", maxLength: 5 }),
    fileName: field.string({ maxLength: 200 }),
    software: field.string({ maxLength: 120 }),
    totalBookQuantity: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    leavesPerBook: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    padQuantity: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    leavesPerPad: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    paperSize: field.string({ maxLength: 120 }),
    paperQuality: field.string({ maxLength: 120 }),
    gramWeightOfPaper: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    printCopies: field.object({
      quantity: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
      sides: field.string({ enum: ["", "single", "both"], defaultValue: "", maxLength: 20 }),
    }),
    watermarkPage: field.string({ enum: ["", "true", "false"], defaultValue: "", maxLength: 10 }),
    inkColor: field.string({ maxLength: 120 }),
    paperColor: field.object({
      firstCopy: field.string({ maxLength: 80 }),
      secondCopy: field.string({ maxLength: 80 }),
      thirdCopy: field.string({ maxLength: 80 }),
      fourthCopy: field.string({ maxLength: 80 }),
      fifthCopy: field.string({ maxLength: 80 }),
    }),
    graph: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    printType: field.string({ enum: ["", "single", "double", "multi"], defaultValue: "", maxLength: 20 }),
    screenPrintingColor: field.string({ maxLength: 120 }),
    stickerSheetSize: field.string({ maxLength: 120 }),
    stickerSheetColor: field.string({ maxLength: 120 }),
    serialNumFrom: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    serialNumTo: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    bookNumFrom: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    bookNumTo: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    perforation: field.string({ maxLength: 120 }),
    perforationCopy: field.string({ maxLength: 120 }),
    PaperCutSize: field.string({ maxLength: 120 }),
    paperCSize: field.string({ maxLength: 120 }),
    plateNumber: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    binding: field.object({
      bindType: field.string({ maxLength: 120 }),
      bothSideCraft: field.string({ maxLength: 120 }),
      pad: field.string({ maxLength: 120 }),
      register: field.string({ maxLength: 120 }),
    }),
    vinylSize: field.string({ maxLength: 120 }),
    sunBoardSize: field.string({ maxLength: 120 }),
    rediumSize: field.string({ maxLength: 120 }),
    stickerMultiCol: field.string({ maxLength: 120 }),
    vCardsMCol: field.string({ maxLength: 120 }),
    vCardsBothSide: field.string({ maxLength: 120 }),
    vCardsXeroxCol: field.string({ maxLength: 120 }),
    vCardsLamination: field.string({ maxLength: 120 }),
    laminationAdd: field.string({ maxLength: 120 }),
    vCardsLaminationAdd: field.string({ maxLength: 120 }),
    xerox: field.object({
      colorXerox: field.string({ maxLength: 120 }),
      singleSide: field.string({ maxLength: 120 }),
      quantity: field.string({ maxLength: 120 }),
      size: field.string({ maxLength: 120 }),
    }),
    idCard: field.object({
      idType: field.string({ maxLength: 120 }),
      side: field.string({ maxLength: 120 }),
      quantity: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
    }),
    pdfPigmentation: field.object({
      single: field.string({ maxLength: 120 }),
      size: field.string({ maxLength: 120 }),
      quantity: field.number({ allowEmpty: true, defaultValue: "", min: 0 }),
      spiralBinding: field.string({ maxLength: 120 }),
      otherJobs: field.string({ maxLength: 120 }),
      otherSize: field.string({ maxLength: 120 }),
      otherQuantity: field.string({ maxLength: 120 }),
    }),
  }),
});

const normalizeDate = (value, defaultValue) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === "" || value === null) {
    return defaultValue;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return defaultValue;
  }

  return date.toISOString().slice(0, 10);
};

const normalizeString = (value, schema, partial) => {
  if (value === undefined) {
    return partial ? undefined : schema.defaultValue;
  }

  const normalized = typeof value === "string"
    ? value.trim()
    : value === null
      ? ""
      : String(value).trim();

  if (schema.enum?.length && !schema.enum.includes(normalized)) {
    return schema.defaultValue;
  }

  return normalized.slice(0, schema.maxLength);
};

const normalizeNumber = (value, schema, partial) => {
  if (value === undefined) {
    return partial ? undefined : schema.defaultValue;
  }

  if (value === "" || value === null) {
    return schema.allowEmpty ? "" : schema.defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return schema.allowEmpty ? "" : schema.defaultValue;
  }

  let normalized = schema.integer ? Math.trunc(parsed) : parsed;

  if (typeof schema.min === "number") {
    normalized = Math.max(schema.min, normalized);
  }

  if (typeof schema.max === "number") {
    normalized = Math.min(schema.max, normalized);
  }

  return normalized;
};

const normalizeField = (value, schema, partial) => {
  switch (schema.kind) {
    case "string":
      return normalizeString(value, schema, partial);
    case "number":
      return normalizeNumber(value, schema, partial);
    case "date":
      if (value === undefined) {
        return partial ? undefined : schema.defaultValue;
      }

      return normalizeDate(value, schema.defaultValue);
    case "array": {
      if (value === undefined) {
        return partial ? undefined : schema.defaultValue;
      }

      if (!Array.isArray(value)) {
        return partial ? undefined : schema.defaultValue;
      }

      return value
        .slice(0, schema.maxLength)
        .map((item) => normalizeField(item, schema.itemSchema, false));
    }
    case "object": {
      if (value === undefined) {
        if (partial) {
          return undefined;
        }

        return normalizeField({}, schema, false);
      }

      const source = isPlainObject(value) ? value : {};
      const result = {};

      for (const [key, childSchema] of Object.entries(schema.shape)) {
        const normalized = normalizeField(source[key], childSchema, partial);

        if (normalized !== undefined) {
          result[key] = normalized;
        }
      }

      if (partial && Object.keys(result).length === 0) {
        return undefined;
      }

      return result;
    }
    default:
      return undefined;
  }
};

const ensureCustomerRules = (customer) => {
  if (!customer.partyName) {
    throw new Error("Party name is required");
  }

  if (!customer.address) {
    throw new Error("Address is required");
  }

  if (!customer.mobile) {
    throw new Error("Mobile number is required");
  }

  if (!customer.date || !customer.expectedDeliveryDate) {
    throw new Error("Order and delivery dates are required");
  }

  if (new Date(customer.date) > new Date(customer.expectedDeliveryDate)) {
    throw new Error("Order date must be before or equal to delivery date");
  }

  if (customer.advance > customer.totalAmount) {
    throw new Error("Advance cannot be greater than total amount");
  }
};

export const normalizeCustomerPayload = (input) => {
  const normalized = normalizeField(input, customerSchema, false);

  normalized.mediaCount = Math.max(
    normalized.mediaCount,
    normalized.mediaDetails.length,
    1,
  );

  ensureCustomerRules(normalized);
  return normalized;
};

export const normalizeCustomerUpdate = (input) => {
  const normalized = normalizeField(input, customerSchema, true);

  if (!normalized || Object.keys(normalized).length === 0) {
    throw new Error("No valid customer fields were provided");
  }

  if (Array.isArray(normalized.mediaDetails) && normalized.mediaDetails.length > 0) {
    normalized.mediaCount = Math.max(
      typeof normalized.mediaCount === "number" ? normalized.mediaCount : 0,
      normalized.mediaDetails.length,
    );
  }

  if (
    normalized.date &&
    normalized.expectedDeliveryDate &&
    new Date(normalized.date) > new Date(normalized.expectedDeliveryDate)
  ) {
    throw new Error("Order date must be before or equal to delivery date");
  }

  if (
    typeof normalized.totalAmount === "number" &&
    typeof normalized.advance === "number" &&
    normalized.advance > normalized.totalAmount
  ) {
    throw new Error("Advance cannot be greater than total amount");
  }

  return normalized;
};

export const normalizeCustomerCollection = (rawCustomers) => {
  const values = Array.isArray(rawCustomers)
    ? rawCustomers
    : isPlainObject(rawCustomers)
      ? Object.values(rawCustomers)
      : [];

  return values.sort((left, right) => {
    const rightTime = new Date(right?.date || 0).getTime();
    const leftTime = new Date(left?.date || 0).getTime();
    return rightTime - leftTime;
  });
};

export const assertCustomerId = (value) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("Customer id is required");
  }

  return value.trim();
};
