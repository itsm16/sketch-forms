import db, { and, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { responsesTable } from "@repo/database/models/response";
import {
  type CreateFormInputType,
  type SubmitResponseInputType,
  type UpdateFormInputType,
} from "./model";

class FormService {
  public async createForm(userId: string, payload: CreateFormInputType) {
    const { title, tagline, canvasJson, theme, successAnimation } = payload;

    const [form] = await db
      .insert(formsTable)
      .values({
        userId,
        title,
        tagline: tagline ?? null,
        canvasJson: canvasJson ?? { data: [] },
        theme: theme ?? "paper",
        successAnimation: successAnimation ?? "confetti",
      })
      .returning();

    if (!form) {
      throw new Error("Failed to create form");
    }

    return { form };
  }

  public async getFormById(id: string) {
    const [form] = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.id, id))
      .limit(1);

    if (!form) {
      throw new Error("Form not found");
    }

    return { form };
  }

  public async getFormsByUserId(userId: string) {
    const forms = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.userId, userId));

    return { forms };
  }

  public async updateForm(
    userId: string,
    formId: string,
    payload: Omit<UpdateFormInputType, "formId">,
  ) {
    const [form] = await db
      .update(formsTable)
      .set(payload)
      .where(and(eq(formsTable.id, formId), eq(formsTable.userId, userId)))
      .returning();

    if (!form) {
      throw new Error("Failed to update form");
    }

    return { form };
  }

  public async deleteForm(userId: string, formId: string) {
    const [form] = await db
      .delete(formsTable)
      .where(and(eq(formsTable.id, formId), eq(formsTable.userId, userId)))
      .returning();

    if (!form) {
      throw new Error("Failed to delete form");
    }

    return { form };
  }

  public async submitResponse(payload: SubmitResponseInputType) {
    const { form } = await this.getFormById(payload.formId);

    if (!form.isLive) {
      throw new Error("This form is no longer accepting responses");
    }

    const [response] = await db
      .insert(responsesTable)
      .values({
        formId: form.id,
        answers: payload.answers,
      })
      .returning();

    if (!response) {
      throw new Error("Failed to save response");
    }

    return { response };
  }

  public async getResponsesByFormId(userId: string, formId: string) {
    const { form } = await this.getFormById(formId);

    if (form.userId !== userId) {
      throw new Error("Form not found");
    }

    const responses = await db
      .select()
      .from(responsesTable)
      .where(eq(responsesTable.formId, formId));

    return { form, responses };
  }
}

export default FormService;
