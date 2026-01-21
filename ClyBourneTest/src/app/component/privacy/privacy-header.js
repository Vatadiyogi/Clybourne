import { SectionWrapper } from "../generalComponent/SectionWrapper";
import { FaCheck, FaChartLine, FaGem } from "react-icons/fa";
import { LuPackageOpen } from "react-icons/lu";
import GreenButton from "../GeneralButton";
import Image from "next/image";
import GreenStripImg from "../../../static/images/green-strip-logo.png";

const plans = [
  {
    icon: <LuPackageOpen className="text-themegreen lg:text-4xl text-3xl" />,
    title: "Business Owner Plan",
    subtitle: "Limited Time Access",
    features: [
      "2 valuation methods included",
      "Industry research for WACC calculation",
      "Trusted data sources & access to downloadable PDF report",
      "1 modification allowed within 48 hours after the report delivered",
      "Advanced financial projection support"
    ],
    price: "$109",
    cta: "BUY NOW"
  },
  {
    icon: <FaChartLine className="text-themegreen lg:text-4xl text-3xl" />,
    title: "Business Owner Plus Plan",
    subtitle: "Extended Access",
    features: [
      "All features included in Business Owner Plan",
      "Additionally, get real time support from the experts to fill your financial results and projections"
    ],
    price: "$159",
    cta: "BUY NOW"
  },
  {
    icon: <FaGem className="text-themegreen lg:text-4xl text-3xl" />,
    title: <>Advisor<br />Plan</>,
    subtitle: "Bulk Valuation for Professionals",
    features: [
      "All features included in Business Owner Plan",
      "Customizable report packages",
      "Choose the number of reports ",
      "Bulk discounts available",
      "Ideal for financial advisors, investors, and consultants"
    ],
    dropdowns: ["Nos. of Reports", "Nos. of Access Days", "Price to Pay"],
    cta: "TALK TO US"
  }
];

const reports = [
  [10, 20, 30, 50, 70, 100],
  ["25 days", "45 days", "65 days", "100 days", "130 days", "180 days"],
  ["$999", "$1,899", "$2,699", "$3,999", "$5,049", "$6,499"]
]

export default function PrivacyCmp() {
  return (
    <div className="relative w-full">
      {/* Top Section */}
      <SectionWrapper customClass="bg-themeblue !pb-48 ">
        <div className="text-center max-w-4xl mx-auto lg:pt-10 md:pt-5 pb-0 sm:pb-4 md:pb-8">
          <h1 className="text-themegreen text-3xl md:text-4xl lg:text-6xl mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs md:text-sm lg:text-xl text-white mb-8">
            Effective as on 1st September 2024
          </p>

        </div>
      </SectionWrapper>

      {/* Pricing Cards */}
      <div className="relative w-full z-10 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36 -mt-56">
        <div className="absolute right-0 top-0 -translate-y-1/2 z-[10] hidden lg:block" >
          <Image src={GreenStripImg} width={"200"} height={250} alt="logo-strip" />
        </div>
        <div className=" gap-10 md:gap-6 xl:gap-10 z-0">
          <main className="max-w-5xl mx-auto py-5">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-8 space-y-6">
                <p className="text-slate-700">
                  This Privacy Policy describes how <strong>Clybourne Insights</strong> ("we," "our," "us," or "Clybourne"),
                  as the data controller, collects, uses, maintains, protects, and discloses personal and financial information
                  from users ("you" or "your") of our online valuation portal and website (the "Services"). This policy is designed
                  to comply with the General Data Protection Regulation (GDPR) and relevant U.S. data protection laws, including
                  the California Consumer Privacy Act (CCPA). By using our Services, you agree to the data practices described in this policy.
                </p>
                {/* <!-- Quick actions --> */}
                <div className="space-y-4">
                  <div className="group bg-slate-50 rounded-md p-4" open>
                    <p className="cursor-pointer select-none font-medium text-slate-900">
                      1. Information We Collect and the Legal Basis for Processing
                    </p>
                    <div className="mt-3 text-slate-700 space-y-3">
                      <p>We collect various categories of information from you to provide our valuation services. The legal basis for this processing is a combination of contractual <strong>necessity, legitimate interest</strong>, and, in specific cases, <strong>your consent.</strong></p>

                      <div className="space-y-2">
                        <h4 className="font-semibold">Information You Provide:</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                          <li><strong>Account and Contact Information:</strong> We collect your name, email address, phone number, and company name when you register. This is necessary to create and manage your account, communicate with you, and deliver the final report.</li>
                          <li><strong>Company Financial and Operational Data:</strong> You provide detailed historical financials (e.g., income statements, balance sheets) and projected financial data (e.g., revenue growth, profit margins). This information is the core input for our valuation models and is processed under the legal basis of contractual necessity.</li>
                          <li><strong>Correspondence:</strong>We collect records of your communications with us. We process this under our legitimate interest to provide effective customer support and service improvements.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">Information We Collect Automatically:</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                          <li><strong>Usage and Technical Data:</strong>We collect non-personally identifiable information, such as your IP address, browser type, and interactions with our website. This is processed under our legitimate interest to analyze trends, administer the site, and improve our Services.</li>
                          <li><strong>Cookies and Tracking:</strong>We use cookies and similar technologies. We rely on your consent for non-essential cookies (e.g., for analytics or marketing). For essential cookies necessary for the website's functionality, the legal basis is our legitimate interest.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Section 2 --> */}
                  <div className="group bg-slate-50 rounded-md p-4">
                    <p className="cursor-pointer select-none font-medium text-slate-900">2. How We Use Your Information</p>
                    <div className="mt-3 text-slate-700 space-y-3">
                      <ul className="list-decimal pl-5 space-y-2 text-sm">
                        <li><strong>To Generate Valuation Reports (Contractual Necessity): </strong>The primary purpose is to use your company's financial data as inputs for our AI-driven models and human expert analysis to produce a detailed and accurate valuation report.</li>
                        <li><strong>To Manage Your Account and Provide Customer Support (Contractual Necessity & Legitimate Interest): </strong>We use your contact information to set up and manage your account, provide technical support, and fulfill service requests.</li>
                        <li><strong>For Internal Business Operations (Legitimate Interest): </strong>We use your data to enhance our platform, refine our AI valuation models, and conduct internal research and development. We do so in a manner that is secure and minimizes the use of personally identifiable information.</li>
                        <li><strong>To Ensure Security and Prevent Fraud (Legitimate Interest): </strong>We process technical data to protect our platform from unauthorized access, fraud, and other security threats.</li>
                        <li><strong>To Comply with Legal Obligations : </strong>We may process your information to comply with a court order, a legal process, or other regulatory requirements.</li>
                      </ul>
                    </div>
                  </div>

                  {/* <!-- Section 3 --> */}
                  <div className="group bg-slate-50 rounded-md p-4">
                    <p className="cursor-pointer select-none font-medium text-slate-900">3. Data Sharing and Disclosure</p>
                    <div className="mt-3 text-slate-700 space-y-3 text-sm">
                      <p>We do not sell, rent, or trade your personal or financial data. We only share data under the following circumstances, with appropriate safeguards in place:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>With Our Valuation Experts: </strong>Your company's data is shared with our internal team of valuation professionals to ensure the quality and accuracy of the report. These individuals are subject to strict confidentiality obligations.</li>
                        <li><strong>With Third-Party Service Providers: </strong>We engage trusted third-party vendors (e.g., cloud hosting services, payment processors, analytics providers) to perform functions on our behalf. These service providers are contractually obligated to process your data only as instructed by us and to maintain its security and confidentiality.</li>
                        <li><strong>For Legal and Regulatory Purposes: </strong>We may disclose your data if legally required to do so by a court order, subpoena, or other legal process.</li>
                        <li><strong>For Business Transfers: </strong>In the event of a merger, acquisition, or sale of our assets, your data may be transferred to the acquiring entity. We will ensure the new entity adheres to a privacy policy that provides the same level of protection.</li>
                      </ul>
                      <p className="mt-2"><strong>Notice to California Residents (CCPA/CPRA): </strong>We do not "sell" or "share" your personal information for cross-context behavioral advertising as those terms are defined under the CCPA/CPRA.</p>
                    </div>
                  </div>

                  {/* <!-- Section 4 --> */}
                  <div className="group bg-slate-50 rounded-md p-4">
                    <p className="cursor-pointer select-none font-medium text-slate-900">4. International Data Transfers (GDPR Compliance)</p>
                    <div className="mt-3 text-slate-700 text-sm">
                      <p>As we operate globally, your data may be transferred to, and processed in, countries outside of the European Economic Area (EEA), which may not have the same level of data protection. When we transfer your personal data outside the EEA, we ensure a high level of data protection is maintained by implementing appropriate safeguards, such as the European Commission's approved <strong>Standard Contractual Clauses (SCCs)</strong>.</p>
                    </div>
                  </div>

                  {/* <!-- Section 5 --> */}
                  <div className="group bg-slate-50 rounded-md p-4">
                    <p className="cursor-pointer select-none font-medium text-slate-900">5. Data Retention</p>
                    <div className="mt-3 text-slate-700 text-sm">
                      <p>We retain your personal and financial information for as long as your account is active and as necessary to fulfill the purposes for which it was collected. After you close your account, we will retain your data for a period necessary to comply with our legal and regulatory obligations, resolve disputes, and enforce our agreements. Anonymized and aggregated data, which cannot be used to identify you, may be retained indefinitely for analytical and research purposes.</p>
                    </div>
                  </div>

                  {/* <!-- Section 6 --> */}
                  <div className="group bg-slate-50 rounded-md p-4">
                    <p className="cursor-pointer select-none font-medium text-slate-900">6. Your Data Protection Rights</p>
                    <div className="mt-3 text-slate-700 space-y-2 text-sm">
                      <p>You have specific rights regarding your personal data. To exercise these rights, please contact us at <a href="mailto:privacyreq@clybourneinsights.com" className="text-sky-600 hover:underline">privacyreq@clybourneinsights.com</a>. We will respond to your request in accordance with applicable laws.</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Right to Know/Access (GDPR & CCPA): </strong> You have the right to request information about the personal data we hold about you, including the categories of data, the purposes of processing, and with whom we have shared it.</li>
                        <li><strong>Right to Rectification (GDPR) / Right to Correction (CCPA): </strong> You have the right to request that we correct any inaccurate or incomplete personal data.</li>
                        <li><strong>Right to Erasure (GDPR) / Right to Deletion (CCPA): </strong> You have the right to request the deletion of your personal data under certain circumstances (e.g., if the data is no longer necessary for the purpose it was collected).</li>
                        <li><strong>Right to Object to Processing (GDPR): </strong> You have the right to object to the processing of your personal data for reasons relating to your particular situation.</li>
                        <li><strong>Right to Restrict Processing (GDPR): </strong> You have the right to request that we restrict the processing of your data under certain conditions.</li>
                        <li><strong>Right to Data Portability (GDPR & CCPA): </strong> You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to have it transmitted to another controller.</li>
                        <li><strong>Right to Withdraw Consent (GDPR): </strong> If our processing is based on your consent, you have the right to withdraw that consent at any time. This will not affect the lawfulness of processing before the withdrawal.</li>
                        <li><strong>Right to Opt-Out of the Sale/Sharing of Personal Information (CCPA): </strong> As noted, we do not sell or share your personal information. However, you retain the right to direct us not to do so in the future.</li>
                      </ul>
                    </div>
                  </div>

                  {/* <!-- Section 7 --> */}
                  <div className="group bg-slate-50 rounded-md p-4">
                    <p className="cursor-pointer select-none font-medium text-slate-900">7. Automated Decision-Making and Profiling</p>
                    <div className="mt-3 text-slate-700 text-sm">
                      <p>Our valuation Services include AI-driven analysis which can be considered a form of automated processing. While our AI generates initial valuations, a human expert always provides a final review and "touch" on the backend. We do not make automated decisions that produce legal or similarly significant effects on you without human intervention. The logic of our AI models is designed to provide objective, data-driven valuations.</p>
                    </div>
                  </div>

                  {/* <!-- Section 8 --> */}
                  <div className="group bg-slate-50 rounded-md p-4">
                    <p className="cursor-pointer select-none font-medium text-slate-900">8. Security of Your Information</p>
                    <div className="mt-3 text-slate-700 text-sm">
                      <p>We have implemented technical and organizational measures to protect your data from unauthorized access, use, alteration, and disclosure. This includes data encryption, access controls, and secure server environments. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
                    </div>
                  </div>

                  {/* <!-- Section 9 --> */}
                  <div className="group bg-slate-50 rounded-md p-4">
                    <p className="cursor-pointer select-none font-medium text-slate-900">9. Children's Privacy</p>
                    <div className="mt-3 text-slate-700 text-sm">
                      <p>Our Services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information.</p>
                    </div>
                  </div>

                  {/* <!-- Section 10 --> */}
                  <div className="group bg-slate-50 rounded-md p-4">
                    <p className="cursor-pointer select-none font-medium text-slate-900">10. Changes to This Privacy Policy</p>
                    <div className="mt-3 text-slate-700 text-sm">
                      <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Effective Date." Your continued use of the Services after such changes indicates your acceptance of the updated policy.</p>
                    </div>
                  </div>

                </div>

                {/* <!-- Footer / signature --> */}
                <footer className="mt-6 border-t pt-6 text-sm text-slate-600 text-center">
                  <p><strong>Clybourne Insights</strong> — If you have questions about this Privacy Policy, email: <a href="mailto:privacyreq@clybourneinsights.com" className="text-sky-600 hover:underline">privacyreq@clybourneinsights.com</a>.</p>
                </footer>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Responsive Background Section */}
      <section className="md:pt-16 md:pb-12 pt-0 pb-24 px-5 md:px-20 z-0 relative">
        {/* Additional content can go here */}
      </section>
    </div>
  );
}

