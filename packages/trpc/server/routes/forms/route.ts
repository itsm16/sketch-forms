import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";
import { toTRPCError } from "../../utils/errors";
import {
  createFormInput,
  createFormOutput,
  deleteFormInput,
  deleteFormOutput,
  getFormByIdInput,
  getFormByIdOutput,
  getFormResponsesInput,
  getFormResponsesOutput,
  getFormsByUserIdOutput,
  submitResponseInput,
  submitResponseOutput,
  updateFormInput,
  updateFormOutput,
} from "./model";

const getPath = generatePath("/forms");
const TAGS = ["forms"];

export const formsRouter = router({
  CreateForm: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
      },
    })
    .input(createFormInput)
    .output(createFormOutput)
    .mutation(async ({ input, ctx }) => {
      try {
        const { form } = await formService.createForm(ctx.user.id, input);
        return form;
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  GetUserForms: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getUserForms"),
        tags: TAGS,
      },
    })
    .output(getFormsByUserIdOutput)
    .query(async ({ ctx }) => {
      try {
        const { forms } = await formService.getFormsByUserId(ctx.user.id);
        return forms;
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  GetFormById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormById"),
        tags: TAGS,
      },
    })
    .input(getFormByIdInput)
    .output(getFormByIdOutput)
    .query(async ({ input }) => {
      try {
        const { form } = await formService.getFormById(input.formId);
        return form;
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  UpdateForm: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/updateForm"),
        tags: TAGS,
      },
    })
    .input(updateFormInput)
    .output(updateFormOutput)
    .mutation(async ({ input, ctx }) => {
      const { formId, ...payload } = input;

      try {
        const { form } = await formService.updateForm(
          ctx.user.id,
          formId,
          payload,
        );
        return form;
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  DeleteForm: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/deleteForm"),
        tags: TAGS,
      },
    })
    .input(deleteFormInput)
    .output(deleteFormOutput)
    .mutation(async ({ input, ctx }) => {
      try {
        await formService.deleteForm(ctx.user.id, input.formId);
        return { success: true, formId: input.formId };
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  SubmitResponse: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/submitResponse"),
        tags: TAGS,
      },
    })
    .input(submitResponseInput)
    .output(submitResponseOutput)
    .mutation(async ({ input }) => {
      try {
        const { response } = await formService.submitResponse(input);
        return response;
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  GetFormResponses: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormResponses"),
        tags: TAGS,
      },
    })
    .input(getFormResponsesInput)
    .output(getFormResponsesOutput)
    .query(async ({ input, ctx }) => {
      try {
        return await formService.getResponsesByFormId(ctx.user.id, input.formId);
      } catch (error) {
        throw toTRPCError(error);
      }
    }),
});
