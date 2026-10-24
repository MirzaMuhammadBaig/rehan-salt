"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { CircleCheck, LoaderCircle, Mail, Pencil, Send, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { WhatsAppIcon } from "@/components/icons";
import { LOCALE_NAMES, type Locale } from "@/i18n/routing";
import { CATEGORIES, EXTRA_PRODUCT_OPTIONS } from "@/lib/content";
import { suggestEmail } from "@/lib/email-typo";
import { SITE, waLink } from "@/lib/site";

function makeSchema(errors: { name: string; email: string; country: string; message: string }) {
  return z.object({
    name: z.string().trim().min(2, errors.name),
    company: z.string().trim(),
    email: z.email(errors.email),
    phone: z.string().trim(),
    country: z.string().trim().min(2, errors.country),
    product: z.string(),
    quantity: z.string().trim(),
    message: z.string().trim().min(10, errors.message),
    _honey: z.string(), // spam trap: real visitors never see or fill this
  });
}
type QuoteValues = z.infer<ReturnType<typeof makeSchema>>;

/** Isolates an email address as left-to-right so it reads correctly inside Arabic sentences. */
const ltr = (s: string) => `⁦${s}⁩`;

const DEFAULTS: QuoteValues = {
  name: "", company: "", email: "", phone: "", country: "",
  product: CATEGORIES[0].id, quantity: "", message: "", _honey: "",
};

export function QuoteForm() {
  const t = useTranslations("form");
  const tAll = useTranslations();
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();

  // Values waiting for the visitor to confirm in the popup (null = popup closed).
  const [pending, setPending] = useState<QuoteValues | null>(null);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  // Product options: value is a stable id; label is translated; the English name goes in the email.
  const options = useMemo(
    () => [
      ...CATEGORIES.map((c) => ({ id: c.id as string, label: tAll(`categories.${c.id}.name`), en: c.en as string })),
      ...EXTRA_PRODUCT_OPTIONS.map((o) => ({ id: o.id as string, label: t(o.key), en: o.en as string })),
    ],
    [t, tAll],
  );
  const labelFor = (id: string) => options.find((o) => o.id === id)?.label ?? id;

  const schema = useMemo(
    () => makeSchema({ name: t("errors.name"), email: t("errors.email"), country: t("errors.country"), message: t("errors.message") }),
    [t],
  );
  const {
    register, handleSubmit, reset, setValue, getValues, setFocus,
    formState: { errors },
  } = useForm<QuoteValues>({ resolver: zodResolver(schema), defaultValues: DEFAULTS });

  // Preselect the product when arriving from a "Request a Quote" button (?product=<id>).
  useEffect(() => {
    const product = searchParams.get("product");
    if (product && options.some((o) => o.id === product)) setValue("product", product);
  }, [searchParams, setValue, options]);

  const whatsappMessage = (v: Partial<QuoteValues>) => {
    const lines = [tAll("whatsapp.quote")];
    const fields: [string, string | undefined][] = [
      [t("name"), v.name], [t("company"), v.company], [t("country"), v.country],
      [t("product"), v.product ? labelFor(v.product) : undefined], [t("quantity"), v.quantity], [t("message"), v.message],
    ];
    for (const [label, value] of fields) if (value?.trim()) lines.push(`${label}: ${value.trim()}`);
    return waLink(lines.join("\n"));
  };

  // Step 1: form is valid -> show the confirmation popup.
  const onValid = (values: QuoteValues) => {
    if (values._honey) return; // bot
    setPending({ ...values, email: values.email.trim() });
  };

  // Step 2: visitor confirmed -> send to Rehan Salt's inbox.
  const send = async () => {
    if (!pending) return;
    const option = options.find((o) => o.id === pending.product);
    const product = option ? (locale === "en" ? option.en : `${option.en} (${option.label})`) : pending.product;
    const { _honey: _ignored, ...fields } = pending;
    setSending(true);
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...fields,
          product,
          language: LOCALE_NAMES[locale],
          _replyto: pending.email, // "Reply" in the inbox goes straight to the customer
          _subject: `New quote request from ${pending.name} (${pending.country})`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) !== "true") throw new Error(json.message ?? "Send failed");
      setSentTo(pending.email);
      setPending(null);
      reset(DEFAULTS);
      toast.success(t("successTitle"), { description: t("sentText", { email: ltr(pending.email) }) });
    } catch {
      const values = pending;
      setPending(null);
      toast.error(t("errorTitle"), {
        description: t("errorText", { email: ltr(SITE.email) }),
        action: { label: t("whatsappAction"), onClick: () => window.open(whatsappMessage(values), "_blank", "noopener") },
        duration: 12000,
      });
    } finally {
      setSending(false);
    }
  };

  const suggestion = pending ? suggestEmail(pending.email) : null;
  const useSuggestion = () => {
    if (!pending || !suggestion) return;
    setValue("email", suggestion, { shouldValidate: true });
    setPending({ ...pending, email: suggestion });
  };
  const editDetails = () => {
    setPending(null);
    // Return focus to the email field so a wrong address is quick to fix.
    requestAnimationFrame(() => setFocus("email"));
  };

  const fieldError = (name: keyof QuoteValues) =>
    errors[name] ? <p className="field__error" id={`err-${name}`} role="alert">{errors[name]?.message}</p> : null;
  const a11y = (name: keyof QuoteValues) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `err-${name}` : undefined,
  });

  if (sentTo) {
    return (
      <div className="form-success" role="status">
        <CircleCheck className="form-success__icon" aria-hidden="true" />
        <h3>{t("successTitle")}</h3>
        <p>{t("sentText", { email: ltr(sentTo) })}</p>
        <button className="btn btn--outline" type="button" onClick={() => setSentTo(null)}>{t("sendAnother")}</button>
      </div>
    );
  }

  const summary: [string, string][] = pending
    ? ([
        [t("name"), pending.name],
        [t("company"), pending.company],
        [t("country"), pending.country],
        [t("phone"), pending.phone],
        [t("product"), labelFor(pending.product)],
        [t("quantity"), pending.quantity],
        [t("message"), pending.message],
      ].filter(([, v]) => v) as [string, string][])
    : [];

  return (
    <>
      <form onSubmit={handleSubmit(onValid)} noValidate>
        <input type="text" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" {...register("_honey")} />
        <div className="form-grid">
          <div className="field">
            <label htmlFor="f-name">{t("name")} <span>*</span></label>
            <input id="f-name" autoComplete="name" {...register("name")} {...a11y("name")} />
            {fieldError("name")}
          </div>
          <div className="field">
            <label htmlFor="f-company">{t("company")}</label>
            <input id="f-company" autoComplete="organization" {...register("company")} />
          </div>
          <div className="field">
            <label htmlFor="f-email">{t("email")} <span>*</span></label>
            <input id="f-email" type="email" dir="ltr" autoComplete="email" inputMode="email" {...register("email")} {...a11y("email")} />
            {fieldError("email")}
          </div>
          <div className="field">
            <label htmlFor="f-phone">{t("phone")}</label>
            <input id="f-phone" type="tel" dir="ltr" autoComplete="tel" inputMode="tel" {...register("phone")} />
          </div>
          <div className="field">
            <label htmlFor="f-country">{t("country")} <span>*</span></label>
            <input id="f-country" autoComplete="country-name" {...register("country")} {...a11y("country")} />
            {fieldError("country")}
          </div>
          <div className="field">
            <label htmlFor="f-product">{t("product")}</label>
            <select id="f-product" {...register("product")}>
              {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
          <div className="field full">
            <label htmlFor="f-qty">{t("quantity")}</label>
            <input id="f-qty" placeholder={t("quantityPlaceholder")} {...register("quantity")} />
          </div>
          <div className="field full">
            <label htmlFor="f-msg">{t("message")} <span>*</span></label>
            <textarea id="f-msg" placeholder={t("messagePlaceholder")} {...register("message")} {...a11y("message")} />
            {fieldError("message")}
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn--primary" type="submit">
            <Send aria-hidden="true" /> {t("send")}
          </button>
          <button className="btn btn--whatsapp" type="button" onClick={() => window.open(whatsappMessage(getValues()), "_blank", "noopener")}>
            <WhatsAppIcon /> {t("sendWhatsApp")}
          </button>
        </div>
        <p className="form-note">{t("note")}</p>
      </form>

      {/* Confirmation popup: the visitor double-checks their email before anything is sent. */}
      <Dialog.Root open={pending !== null} onOpenChange={(open) => { if (!open && !sending) setPending(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog" onEscapeKeyDown={(e) => sending && e.preventDefault()} onPointerDownOutside={(e) => sending && e.preventDefault()}>
            <Dialog.Close className="icon-btn dialog__close" aria-label={t("confirm.close")} disabled={sending}>
              <X aria-hidden="true" />
            </Dialog.Close>
            <Dialog.Title className="dialog__title">{t("confirm.title")}</Dialog.Title>
            <Dialog.Description className="dialog__text">{t("confirm.text")}</Dialog.Description>

            {pending && (
              <>
                <div className="dialog__email">
                  <Mail aria-hidden="true" />
                  <strong dir="ltr" data-confirm-email>{pending.email}</strong>
                </div>
                {suggestion && (
                  <div className="dialog__suggestion" role="alert">
                    <span>{t("confirm.suggestion", { email: ltr(suggestion) })}</span>
                    <button type="button" className="btn btn--outline btn--sm" onClick={useSuggestion} data-use-suggestion>
                      {t("confirm.useSuggestion")}
                    </button>
                  </div>
                )}
                <h3 className="dialog__subtitle">{t("confirm.summary")}</h3>
                <dl className="dialog__summary">
                  {summary.map(([label, value]) => (
                    // dir="auto": customer-typed text keeps its own direction (e.g. English inside the Arabic page)
                    <div key={label}><dt>{label}</dt><dd dir="auto">{value}</dd></div>
                  ))}
                </dl>
              </>
            )}

            <div className="dialog__actions">
              <button type="button" className="btn btn--outline" onClick={editDetails} disabled={sending}>
                <Pencil aria-hidden="true" /> {t("confirm.edit")}
              </button>
              <button type="button" className="btn btn--primary" onClick={send} disabled={sending} data-confirm-send autoFocus>
                {sending ? <LoaderCircle className="spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
                {sending ? t("sending") : t("confirm.send")}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
