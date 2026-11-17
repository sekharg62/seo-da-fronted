"use client";

import { MonitorCog, Smartphone, ShieldCheck, Clock3 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function HomeServices() {
  const { t } = useLanguage();

  const services = [
    {
      icon: <MonitorCog className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: t('homeServiceStreamingTitle' as any),
      description: t('homeServiceStreamingDesc' as any),
    },
    {
      icon: <Smartphone className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: t('homeServiceAppsTitle' as any),
      description: t('homeServiceAppsDesc' as any),
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: t('homeServiceSecurityTitle' as any),
      description: t('homeServiceSecurityDesc' as any),
    },
    {
      icon: <Clock3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: t('homeServiceAlertsTitle' as any),
      description: t('homeServiceAlertsDesc' as any),
    },
  ];

  return (
    <section
      id="services"
      className="bg-white dark:bg-transparent"
    >
      <div className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-6 md:py-10">
        <div className="mb-6 max-w-2xl md:mb-8">
          <h2 className="mb-1 text-xl font-semibold text-slate-900 dark:text-neutral-50 md:text-2xl">
            {t('homeServicesTitle' as any)}
          </h2>
          <p className="text-sm text-slate-500 dark:text-neutral-400">
            {t('homeServicesBody' as any)}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex items-start gap-3 bg-white p-4 dark:bg-neutral-950 sm:p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-950/50">
                {service.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold leading-tight text-slate-900 dark:text-neutral-50">
                  {service.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-neutral-400">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
