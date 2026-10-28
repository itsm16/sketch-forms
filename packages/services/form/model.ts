import z from "zod";

const canvasJsonSchema = z
  .object({
    data: z.array(z.any()).optional(),
  })
  .passthrough();

const formThemeSchema = z.enum(["paper", "minimal", "midnight"]);
const successAnimationSchema = z.enum(["confetti", "check", "sparkle"]);

const CreateFormInput = z.object({
  title: z.string().min(1).max(40).describe("Form title"),
  tagline: z.string().max(100).nullable().optional().describe("Form tagline"),
  canvasJson: canvasJsonSchema.optional().describe("Form canvas JSON"),
  theme: formThemeSchema.optional().describe("Form visual theme"),
  successAnimation: successAnimationSchema
    .optional()
    .describe("Animation shown after submission"),
});

const UpdateFormInput = z.object({
  formId: z.string().uuid().describe("Form ID"),
  title: z.string().min(1).max(40).optional().describe("Form title"),
  tagline: z.string().max(100).nullable().optional().describe("Form tagline"),
  canvasJson: canvasJsonSchema.optional().describe("Form canvas JSON"),
  isLive: z.boolean().optional().describe("Whether the form accepts responses"),
  theme: formThemeSchema.optional().describe("Form visual theme"),
  successAnimation: successAnimationSchema
    .optional()
    .describe("Animation shown after submission"),
});

const SubmitResponseInput = z.object({
  formId: z.string().uuid().describe("Form ID"),
  answers: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .describe("Answers keyed by field name"),
});

type CreateFormInputType = z.infer<typeof CreateFormInput>;
type UpdateFormInputType = z.infer<typeof UpdateFormInput>;
type SubmitResponseInputType = z.infer<typeof SubmitResponseInput>;

export type {
  CreateFormInputType,
  UpdateFormInputType,
  SubmitResponseInputType,
};

export {
  CreateFormInput,
  UpdateFormInput,
  SubmitResponseInput,
  formThemeSchema,
  successAnimationSchema,
};
