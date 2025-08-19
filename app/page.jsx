
"use client";
import { useEffect, useState } from "react";
import { Card } from "../components/ui";
import { generateEmail, generateVariants } from "../lib/reminder";
export default function Page(){
  const [invoice,setInvoice]=useState(null); const [tone,setTone]=useState("Friendly"); const [email,setEmail]=useState(null); const [variants,setVariants]=useState(null);
  useEffect(()=>{ fetch("/data/invoice.json").then(r=>r.json()).then(inv=>{ setInvoice(inv); setEmail(generateEmail(inv,tone)); }); },[]);
  useEffect(()=>{ if(invoice) setEmail(generateEmail(invoice,tone)); },[tone,invoice]);
  if(!invoice) return null;
  return (<div className="grid md:grid-cols-2 gap-6">
    <Card title="Overdue Invoice">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><div className="x-subtle">Invoice</div><div className="font-medium">{invoice.invoiceId}</div></div>
        <div><div className="x-subtle">Customer</div><div className="font-medium">{invoice.customer.name}</div></div>
        <div><div className="x-subtle">Amount Due</div><div className="font-medium">£{invoice.amountDue.toLocaleString()}</div></div>
        <div><div className="x-subtle">Days Overdue</div><div className="font-medium">{invoice.daysOverdue} days</div></div>
        <div className="col-span-2"><div className="x-subtle">Payment link</div>
          <a className="text-xero-blue underline" href={invoice.paymentLink} target="_blank">{invoice.paymentLink}</a></div>
      </div>
      <div className="mt-4"><label className="x-subtle block mb-1">Tone</label>
        <select className="rounded-lg border-gray-200" value={tone} onChange={e=>setTone(e.target.value)}>
          <option>Friendly</option><option>Neutral</option><option>Firm</option>
        </select></div>
    </Card>
    <Card title="AI-Generated Reminder" action={<button className="x-btn" onClick={()=>setVariants(generateVariants(invoice,tone))}>Create 3 Variants</button>}>
      {!email ? <div className="text-gray-500">Generating…</div> : (<div className="space-y-2">
        <div className="text-sm font-medium">Subject</div><div className="text-[15px]">{email.subject}</div>
        <div className="text-sm font-medium mt-3">Body</div>
        <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-lg border">{email.bodyText}</pre>
        <button className="x-btn mt-3" onClick={()=>navigator.clipboard.writeText(`${email.subject}\n\n${email.bodyText}`)}>Copy</button>
      </div>)}
      {variants && (<div className="mt-6"><div className="x-title mb-2">A/B/C Variants</div>
        <div className="grid gap-3">{variants.variants.map((v,i)=>(<div key={i} className="p-3 bg-white border rounded-lg">
          <div className="text-sm font-medium mb-1">Variant {i+1}</div>
          <div className="text-[15px] mb-1">{v.subject}</div>
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-lg border">{v.bodyText}</pre>
        </div>))}</div></div>)}
    </Card>
  </div>);
}
