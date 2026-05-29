import z from "zod";

const createFormInput = z.object({
    userId: z.string().describe("user's id"),
    title: z.string().describe("form's title"),
    tagline: z.string().describe("form's tagline").optional(),
    canvasJson: z.any().describe("form's canvas json"),
})

// TODO: enhance the output type
const createFormOutput = z.object({
    form: z.any().describe("form"),
})

const deleteFormInput = z.object({
    formId: z.string().describe("form's id"),
})

const deleteFormOutput = z.object({
    success: z.boolean().describe("success"),
    formId: z.string().describe("form's id"),
})

const updateFormInput = z.object({
    formId: z.string().describe("form's id"),
    title: z.string().describe("form's title").optional(),
    tagline: z.string().describe("form's tagline").optional(),
    canvasJson: z.any().describe("form's canvas json").optional(),
})

const updateFormOutput = z.object({
    success: z.boolean().describe("success"),
    formId: z.string().describe("form's id"),
})

export {
    createFormInput,
    createFormOutput,
    deleteFormInput,
    deleteFormOutput,
    updateFormInput,
    updateFormOutput
}
