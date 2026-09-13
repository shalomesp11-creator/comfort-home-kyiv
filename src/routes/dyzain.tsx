import { createFileRoute } from "@tanstack/react-router";
import { DesignPage } from "@/site/site";
import { pageHead } from "@/site/meta";

export const Route = createFileRoute("/dyzain")({
  head: () => pageHead("Дизайн інтерʼєру для квартир і будинків — COMFORT HOME", "Дизайн інтерʼєру квартир і будинків: планування, 3D-візуалізації, робочі креслення, специфікації матеріалів та авторський підхід.", "/dyzain", "/projects/syrets-dining.jpg"),
  component: DesignPage,
});
