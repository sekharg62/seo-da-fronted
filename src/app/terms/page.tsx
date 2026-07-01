import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read our Terms and Conditions. This document outlines the rules and regulations for the use of DigitalAccess BD's Website.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 sm:py-32 lg:px-8">
      <div className="prose prose-emerald dark:prose-invert lg:prose-lg max-w-none">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-8">
          Terms and Conditions
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-12">
          Last updated: July 1, 2026
        </p>

        <section className="mt-10 space-y-8 text-gray-700 dark:text-gray-300">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
            <p>
              Welcome to DigitalAccess BD. These terms and conditions outline the rules and regulations for the use of our website and services.
              By accessing this website we assume you accept these terms and conditions. Do not continue to use DigitalAccess BD if you do not agree to take all of the terms and conditions stated on this page.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. License</h2>
            <p>
              Unless otherwise stated, DigitalAccess BD and/or its licensors own the intellectual property rights for all material on DigitalAccess BD. All intellectual property rights are reserved. You may access this from DigitalAccess BD for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>You must ensure that your account information is accurate and up to date.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Limitation of Liability</h2>
            <p>
              In no event shall DigitalAccess BD, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract. DigitalAccess BD, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this website.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
