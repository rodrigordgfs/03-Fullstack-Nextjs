import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import sendGridMail from "@sendgrid/mail";

const dbCliente = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const httpStatus = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const controllerByMethod = {
  POST: async (request: NextApiRequest, response: NextApiResponse) => {
    const { emailNewsletter } = request.body;

    if (!Boolean(emailNewsletter) || !emailNewsletter.includes("@")) {
      response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "E-mail inválido" });
    }

    await dbCliente
      .from("newsletter_users")
      .insert({ email: emailNewsletter, optin: true });

    await dbCliente.auth.admin.createUser({
      email: emailNewsletter,
    });

    try {
      sendGridMail.setApiKey(process.env.SENDGRID_KEY);
      await sendGridMail.send({
        to: emailNewsletter,
        from: "shinodalabs@gmail.com",
        subject: "Bem-vindo à Newsletter",
        html: "<p>Parabéns por se inscrever no <strong>Shinoda Labs</strong/>. Agradecemos a sua contribuição.</p>",
      });
      response
        .status(httpStatus.CREATED)
        .json({ message: "Cadastrado com sucesso na newsletter" });
    } catch (error) {
      response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Falha ao enviar email" });
    }
  },
  GET: async (request: NextApiRequest, response: NextApiResponse) => {
    const { data, error } = await dbCliente
      .from("newsletter_users")
      .select("*");

    response.status(httpStatus.SUCCESS).json(data);
  },
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const controller = controllerByMethod[request.method];

  if (!controller) {
    response.status(httpStatus.NOT_FOUND).json({ message: "Not found" });
    return;
  }

  controller(request, response);
}
