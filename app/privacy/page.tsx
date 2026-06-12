'use client'

import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Last updated: June 12, 2026</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
        <p>As this is a vocabulary notetaking and learning system, we aim to minimize data collection. Information is collected only when necessary for core functionality, primarily for account management and to provide a personalized experience. This includes essential user data like email and password for authentication purposes only. We adhere to the GDPR principle of data minimization, collecting only what is strictly required.</p>
        <p>User-generated content, such as vocabulary entries and notes, is strictly isolated to the authenticated user's account. We do not collect unnecessary personal details beyond what is essential for authentication and service provision.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services. This includes personalizing your experience and communicating with you.</p>
        <p>Your vocabulary data and notes are used exclusively to enhance your learning experience within the system. We do not use your data for unrelated activities or share it with third parties, adhering to the GDPR principle of purpose limitation.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Data Security and User Content Ownership</h2>
        <p>We implement robust security measures, including secure password hashing (e.g., bcrypt) and access controls, to protect your data from unauthorized access. Your vocabulary data and notes are isolated to your account, ensuring privacy. All vocabularies are user-generated, and we respect intellectual property rights. Content ownership remains with the user, and we do not distribute copyrighted materials without authorization.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Legal Compliance and Ethical Considerations</h2>
        <p>We are committed to adhering to legal frameworks such as the UK GDPR, ensuring lawfulness, fairness, and data minimization. Personal data is collected solely for authentication and account management, aligning with purpose limitation principles. Our system promotes fairness and equality in accessibility, designed for diverse users without discrimination.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Changes to This Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      </section>

      <p>By using our service, you agree to the collection and use of information in accordance with this Privacy Policy.</p>
    </div>
  );
};

export default PrivacyPage;

/* 
Note: This is a basic template. For a real application, you should consult with a legal professional to draft a comprehensive and compliant Privacy Policy.
*/
