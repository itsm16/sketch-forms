import z from "zod";

const formThemeSchema = z.enum(["paper", "minimal", "midnight"]);
const successAnimationSchema = z.enum(["confetti", "check", "sparkle"]);

const formOutput = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  canvasJson: z.any(),
  tagline: z.string().nullable(),
  isLive: z.boolean(),
  theme: formThemeSchema,
  successAnimation: successAnimationSchema,
  createdAt: z.any(),
  updatedAt: z.any(),
});

const createFormInput = z.object({
  title: z.string().min(1).max(40).describe("form's title"),
  tagline: z.string().max(100).nullable().optional().describe("form's tagline"),
  canvasJson: z.any().optional().describe("form's canvas json"),
  theme: formThemeSchema.optional().describe("form's visual theme"),
  successAnimation: successAnimationSchema
    .optional()
    .describe("animation shown after submission"),
});

const createFormOutput = formOutput;

const getFormsByUserIdOutput = z.array(formOutput);

const getFormByIdInput = z.object({
  formId: z.string().uuid().describe("form's id"),
});

const getFormByIdOutput = formOutput;

const deleteFormInput = z.object({
  formId: z.string().uuid().describe("form's id"),
});

const deleteFormOutput = z.object({
  success: z.boolean().describe("success"),
  formId: z.string().describe("form's id"),
});

const updateFormInput = z.object({
  formId: z.string().uuid().describe("form's id"),
  title: z.string().min(1).max(40).optional().describe("form's title"),
  tagline: z.string().max(100).nullable().optional().describe("form's tagline"),
  canvasJson: z.any().optional().describe("form's canvas json"),
  isLive: z.boolean().optional().describe("whether the form is live"),
  theme: formThemeSchema.optional().describe("form's visual theme"),
  successAnimation: successAnimationSchema
    .optional()
    .describe("animation shown after submission"),
});

const updateFormOutput = formOutput;

const submitResponseInput = z.object({
  formId: z.string().uuid().describe("form's id"),
  answers: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .describe("answers keyed by field name"),
});

const submitResponseOutput = z.object({
  id: z.string(),
  formId: z.string(),
  answers: z.any(),
  createdAt: z.any(),
});

const getFormResponsesInput = z.object({
  formId: z.string().uuid().describe("form's id"),
});

const getFormResponsesOutput = z.object({
  form: formOutput,
  responses: z.array(submitResponseOutput),
});

export {
  createFormInput,
  createFormOutput,
  getFormsByUserIdOutput,
  getFormByIdInput,
  getFormByIdOutput,
  deleteFormInput,
  deleteFormOutput,
  updateFormInput,
  updateFormOutput,
  submitResponseInput,
  submitResponseOutput,
  getFormResponsesInput,
  getFormResponsesOutput,
  formThemeSchema,
  successAnimationSchema,
};
