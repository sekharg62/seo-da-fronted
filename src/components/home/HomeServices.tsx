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
      className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/80"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="max-w-2xl mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
            {t('homeServicesTitle' as any)}
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
            {t('homeServicesBody' as any)}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 flex flex-col gap-2 hover:border-emerald-500/50 hover:translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-2">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {service.title}
              </h3>
              <p className="text-xs md:text-xs text-slate-600 dark:text-slate-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
