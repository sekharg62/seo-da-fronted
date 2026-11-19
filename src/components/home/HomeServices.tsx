"use client";

import { MonitorCog, Smartphone, ShieldCheck, Clock3 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function HomeServices() {
  const { t } = useLanguage();

  const services = [
    {
      icon: <MonitorCog className="h-6 w-6 text-amber-700 dark:text-amber-400" />,
      title: t('homeServiceStreamingTitle'),
      description: t('homeServiceStreamingDesc'),
    },
    {
      icon: <Smartphone className="h-6 w-6 text-amber-700 dark:text-amber-400" />,
      title: t('homeServiceAppsTitle'),
      description: t('homeServiceAppsDesc'),
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-amber-700 dark:text-amber-400" />,
      title: t('homeServiceSecurityTitle'),
      description: t('homeServiceSecurityDesc'),
    },
    {
      icon: <Clock3 className="h-6 w-6 text-amber-700 dark:text-amber-400" />,
      title: t('homeServiceAlertsTitle'),
      description: t('homeServiceAlertsDesc'),
    },
  ];

  return (
    <section
      id="services"
      className="bg-white dark:bg-black"
    >
      <div className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-6 md:py-10">
        <div className="mb-6 max-w-2xl md:mb-8">
          <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-neutral-50 md:text-2xl">
            {t('homeServicesTitle')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            {t('homeServicesBody')}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex items-start gap-3 bg-white p-4 dark:bg-[#0f0f0f] sm:p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950/50">
                {service.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold leading-tight text-gray-900 dark:text-neutral-50">
                  {service.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-neutral-400">
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
