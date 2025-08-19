
function fmtGBP(n){ return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(n); }
export function generateEmail(invoice,tone='Friendly'){
  const presets={ Friendly:{cta:'Please use the payment link below when you get a moment.'},
                  Neutral:{cta:'Please arrange payment at your earliest convenience.'},
                  Firm:{cta:'Please pay immediately to avoid late fees per our terms.'} };
  const p=presets[tone]||presets.Neutral;
  const facts=`${invoice.invoiceId} for ${fmtGBP(invoice.amountDue)} (due ${invoice.dueDate}, now ${invoice.daysOverdue} days overdue)`;
  const subject={ Friendly:`Quick nudge on ${invoice.invoiceId} — ${fmtGBP(invoice.amountDue)}`,
                  Neutral:`Reminder: ${invoice.invoiceId} outstanding`,
                  Firm:`Final notice: ${invoice.invoiceId} overdue` }[tone] || `Reminder: ${invoice.invoiceId} outstanding`;
  const greeting=`Hi ${invoice.customer.contactFirstName || invoice.customer.name},`;
  const ack=(tone!=='Firm' && invoice.history?.lastNote)?` Thanks for the update last time: “${invoice.history.lastNote}”.`:'';
  const body=[greeting,"",`Just a quick reminder about invoice ${facts}.${ack}`,"",p.cta,invoice.paymentLink||"","",
              "If you've already made the payment, please ignore this message.","","Best,",invoice.yourBrand?.signatureName||"Accounts Team",
              invoice.yourBrand?.businessName||"", invoice.yourBrand?.replyTo?`Reply-to: ${invoice.yourBrand.replyTo}`:""].join("\n");
  return { subject, bodyText: body };
}
export function generateVariants(invoice,tone='Friendly'){ return { variants:[ generateEmail(invoice,tone), generateEmail(invoice,'Neutral'), generateEmail(invoice,'Firm') ]}; }
