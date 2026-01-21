import { Globe } from "lucide-react";
import { SectionWrapper } from "../generalComponent/SectionWrapper";

export default function VerifiedMarket() {
    return (
        <SectionWrapper customClass="bg-lightgrey">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 lg:gap-4 gap-2 items-center">
                    <div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl text-themeblue mb-4">
                            Verified Market Multiples
                            and Data Sources
                        </h2>
                    </div>
                    <p className="text-themedark xl:text-xl lg:text-lg md:text-base sm:text-sm">
Access global valuation multiples derived from over 100,000 publicly traded companies across 130+ stock exchanges, with 900 million+ data points updated regularly—enabling accurate comparisons with industry-relevant peers.                    </p>
                </div>
            </div>
        </SectionWrapper>
    );
}
