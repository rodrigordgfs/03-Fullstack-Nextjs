import Box from "@src/components/Box/Box";
import Button from "@src/components/Button/Button";
import Image from "@src/components/Image/Image";
import Text from "@src/components/Text/Text";
import { BaseComponent } from "@src/theme/BaseComponent";
import { useState } from "react";

function useForm({ initialValues }) {
  const [values, setValues] = useState(initialValues);
  return {
    values,
    handleChange(event) {
      const { name, value } = event.target;
      setValues({ ...values, [name]: value });
    },
  };
}

export default function NewsletterScreen() {
  const form = useForm({
    initialValues: {
      emailNewsletter: "",
    },
  });

  return (
    <Box
      styleSheet={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        styleSheet={{
          alignItems: "center",
          width: "100%",
          maxWidth: "800px",
          padding: "16px",
        }}
      >
        <Image
          src="https://github.com/rodrigordgfs.png"
          alt="Foto do Shinoda Labs"
          styleSheet={{
            borderRadius: "100%",
            width: "100px",
            marginBottom: "16px",
          }}
        />
        <Text variant="heading2" styleSheet={{ textAlign: "center" }}>
          Newsletter do ShinodaLabs
        </Text>
        <BaseComponent
          as="form"
          styleSheet={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onSubmit={(event) => {
            event.preventDefault();

            if (!form.values.emailNewsletter.includes("@")) {
              alert("Email inválido");
              return;
            }

            fetch("/api/newsletter/optin", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(form.values),
            }).then(async (response) => {
              console.log(await response.json());
            });
          }}
        >
          <NewsletterTextField
            placeholder="Informe seu e-mail"
            name="emailNewsletter"
            value={form.values.emailNewsletter}
            onChange={form.handleChange}
          />
          <Button
            fullWidth
            styleSheet={{ marginTop: "16px", width: "100%", maxWidth: "300px" }}
          >
            Cadastrar
          </Button>
          <Box>
            <Text>Seu email é: {form.values.emailNewsletter}</Text>
          </Box>
        </BaseComponent>
      </Box>
    </Box>
  );
}

interface NewsletterTextFieldProps {
  placeholder?: string;
  value?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function NewsletterTextField(props: NewsletterTextFieldProps) {
  return (
    <Box
      styleSheet={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        marginTop: "8px",
      }}
    >
      <BaseComponent
        as="input"
        {...props}
        styleSheet={{
          border: "1px solid rgb(195, 195, 195)",
          borderRadius: "4px",
          padding: "8px",
          maxWidth: "300px",
          width: "100%",
        }}
      />
    </Box>
  );
}
