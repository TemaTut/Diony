"use client";

import { ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import Button from "@/components/UI/Button";
import IconButton from "@/components/UI/IconButton";
import Input from "@/components/UI/Input";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  useClickOutside(dialogRef, onClose);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <section ref={dialogRef} className="relative w-full max-w-[420px] rounded-shell border border-line bg-surface p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <IconButton className="absolute right-4 top-4" type="button" onClick={onClose} aria-label="Закрыть"><X size={19} /></IconButton>
        {submitted ? (
          <div className="space-y-4 pr-8" role="status">
            <span className="grid size-11 place-items-center rounded-full bg-white/10 text-h2">P</span>
            <h2 id="login-title" className="text-h2">Скоро будем на связи</h2>
            <p className="text-base text-muted">Вход по адресу {email} появится после подключения авторизации.</p>
            <Button type="button" onClick={onClose}>Понятно</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 pr-8">
              <span className="grid size-11 place-items-center rounded-full bg-white/10 text-h2">P</span>
              <h2 id="login-title" className="text-h2">Войдите в Diony</h2>
              <p className="text-base text-muted">Сохраняйте работы и возвращайтесь к своим идеям.</p>
            </div>
            <form className="mt-6 space-y-3" onSubmit={submit}>
              <label className="block text-small text-muted" htmlFor="login-email">Электронная почта</label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Button className="w-full" type="submit">Продолжить <ArrowRight size={17} /></Button>
            </form>
            <p className="mt-4 text-caption text-muted">Демо-режим · авторизация пока не подключена</p>
          </>
        )}
      </section>
    </div>
  );
}
