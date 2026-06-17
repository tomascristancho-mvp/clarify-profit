import { Header } from "@/components/layout/Header";
import { EducationalNotice } from "@/components/layout/EducationalNotice";
import { CalculatorApp } from "@/components/CalculatorApp";

export default function Page() {
  return (
    <>
      <Header />
      <CalculatorApp />
      <EducationalNotice />
    </>
  );
}
