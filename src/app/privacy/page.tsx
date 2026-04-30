import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read our Privacy Policy. Learn how DigitalAccess BD collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 sm:py-32 lg:px-8">
      <div className="prose prose-emerald dark:prose-invert lg:prose-lg max-w-none">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-8">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-12">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mt-10 space-y-8 text-gray-700 dark:text-gray-300">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p>
              We collect information to provide better services to all our users. The types of personal information we collect include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Information you provide to us directly (e.g., name, email address, phone number).</li>
              <li>Information we get from your use of our services (e.g., IP address, device information, log data).</li>
              <li>Cookies and similar tracking technologies to track activity on our services.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. How We Use Information</h2>
            <p>
              We use the information we collect from all our services for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>To provide, maintain, and improve our services.</li>
              <li>To develop new services and features.</li>
              <li>To understand and analyze how you use our services.</li>
              <li>To communicate with you, either directly or through one of our partners, including for customer service.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Data Security</h2>
            <p>
              We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Contact Us</h2>
            <p>
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@digitalaccess-bd.com.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
