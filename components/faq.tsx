"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      q: "What formats are supported?",
      a: "CSV files are supported for the MVP. Export your dataset to CSV and upload it.",
    },
    {
      q: "Where does the analysis run?",
      a: "In-browser for the demo preview. For deeper analysis or larger files, use the included Python script.",
    },
    {
      q: "Can I export the report?",
      a: "Yes. Right-click the PNG preview to save it. The Python CLI also exports PNG and a text summary.",
    },
    {
      q: "What’s coming next?",
      a: "Leak detection, PDF export, and a CLI for batch processing.",
    },
  ]
  return (
    <div className="px-4">
      <div className="mx-auto max-w-3xl glass rounded-2xl p-4">
        <h2 className="font-heading font-extrabold uppercase tracking-widest text-2xl mb-2 px-2">FAQ</h2>
        <Accordion type="single" collapsible className="divide-y divide-[var(--color-border)]">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="hover:text-foreground/90">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
