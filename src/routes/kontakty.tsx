import { createFileRoute } from "@tanstack/react-router";
import { ContactsPage } from "@/site/site";
import { pageHead } from "@/site/meta";

export const Route = createFileRoute("/kontakty")({
  head: () => pageHead("Контакти — COMFORT HOME", "Контакти COMFORT HOME у Києві: телефон, електронна пошта, Telegram, Viber, WhatsApp та коротка заявка на ремонт, дизайн або будівництво.", "/kontakty", "/brand/comfort-home-logo.png"),
  component: ContactsPage,
});
