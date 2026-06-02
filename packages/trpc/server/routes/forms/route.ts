import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";
import { createFormInput, createFormOutput, getFormsByUserIdInput, getFormsByUserIdOutput } from "./model";

const getPath = generatePath("/forms");
const TAGS = ["forms"];

export const formsRouter = router({
  CreateForm: publicProcedure
  .meta({
    openapi: {
      method: "POST",
      path: getPath("/createForm"),
      tags: TAGS,
    }
  })
  .input(createFormInput).output(createFormOutput)
  .mutation(async ({ input }) => {
    const { form } = await formService.createForm(input);
    return form;
  }),
  GetUserForms: publicProcedure
  .meta({
    openapi: {
      method: "GET",
      path: getPath("/getUserForms"),
      tags: TAGS,
    }
  })
  .input(getFormsByUserIdInput).output(getFormsByUserIdOutput)
  .query(async ({ input }) => {
    const { forms } = await formService.getFormsByUserId(input.userId);
    return forms;
  }),
  GetFormById: publicProcedure
  .meta({
    openapi: {
      method: "GET",
      path: getPath("/getFormById"),
      tags: TAGS,
    }
  })
  .input(getFormsByUserIdInput).output(getFormsByUserIdOutput)
  .query(async ({ input }) => {
    const { form } = await formService.getFormById(input.userId);
    return form;
  }),
  UpdateForm: publicProcedure
  .meta({
    openapi: {
      method: "PUT",
      path: getPath("/updateForm"),
      tags: TAGS,
    }
  })
  .input(createFormInput).output(createFormOutput)
  .mutation(async ({ input }) => {
    const { form } = await formService.updateForm(input.userId, input);
    return form;
  }),

});
