'use client';

export default function HowWork() {
  const steps = [
    {
      title: 'Connect Your Data',
      description: 'Plug into our secure and easy-to-use platform.',
    },
    {
      title: 'Generate Insights',
      description: 'AI-powered valuations delivered within 2 working days.',
    },
    {
      title: <>Take<br />Action</>,
      description: 'Use insights to plan growth, investment, or sale with confidence.',
    },
  ];

  return (
    <section className="bg-lightgrey px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36  py-12 lg:py-40 xl:py-60 relative">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 relative z-10">
        {/* Left Text */}
        <div className="lg:w-1/2 w-full pr-6">
          <h2 className="text-themeblue text-3xl sm:text-4xl lg:text-6xl xl:text-7xl">
            How Clybourne Works?
          </h2>
          <h3 className="text-themegreen text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-teko">
            Valuations Designed for Simplicity and Speed
          </h3>
        </div>

        {/* Right Steps */}
        <div className="lg:w-1/2 w-full flex flex-col sm:flex-row justify-between items-center lg:items-stretch gap-4 relative z-10">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-themeblue text-themegreen rounded-md px-6 py-5 w-full sm:w-1/3 lg:w-[32%] text-left transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <h3 className="text-xl lg:text-base xl:text-xl mb-2 font-semibold">{step.title}</h3>
              <p className="text-sm lg:text-xs xl:text-sm text-white">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Background Box */}
      <div className="hidden lg:block absolute right-0 top-0 xl:mt-32 lg:mt-24 w-[29%] h-[60%] bg-themegreen z-0"></div>
    </section>
  );
}
