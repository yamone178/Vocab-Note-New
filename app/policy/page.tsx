'use client'

import React from 'react';

const PolicyPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">Last updated: June 12, 2026</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>By accessing or using our vocabulary notetaking and learning system, you agree to be bound by these Terms of Service.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Use of Service</h2>
        <p>You agree to use the service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Intellectual Property</h2>
        <p>All content and intellectual property on this service are owned by us or our licensors. You may not copy, modify, or distribute any content without our permission.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. User Content</h2>
        <p>Any content you submit, such as notes or vocabulary lists, remains your property. However, by submitting content, you grant us a license to use, reproduce, and display it as necessary to provide the service.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Disclaimers and Limitation of Liability</h2>
        <p>The service is provided "as is." We disclaim all warranties and will not be liable for any damages arising from your use of the service.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. Your continued use of the service after changes constitutes acceptance.</p>
      </section>

      <p>If you have any questions about these Terms, please contact us.</p>
    </div>
  );
};

export default PolicyPage;

/* 
Note: This is a basic template. For a real application, you should consult with a legal professional to draft comprehensive Terms of Service.
*/
