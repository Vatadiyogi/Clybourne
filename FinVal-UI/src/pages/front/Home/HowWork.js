import poster from '../../../assets/finimg/poster.png';

const HowWork = () => {
   return (
    <section className="big-section padding-60-60 bg-section-new">
        <div className="container text-center">
            <h2 className="alt-font fw-600 ls-minus-2px text-base-color mb-2 margin-8px">How We <span style={{ color: "#4ea8f6" }}>Work</span></h2>
            <div className="row g-0 position-relative z-index-1 d-flex justify-content-center align-items-center" style={{ objectFit: "contain" }}>
                <div className="col-10 position-relative  border-radius-6px h-550px lg-h-450px md-h-400px  sm-h-230px d-flex align-items-center justify-content-center" style={{ objectFit: "contain" }}>
                    <video muted className="video-bg html-video border-radius-6px video-play-icon" poster={poster} style={{ objectFit: "contain" }}>
                        <source type="video/mp4" src="video/video.mp4" />
                        <source type="video/webm" src="video/video.webm" />
                    </video>
                    <a href="/" className="html-video-play video-icon-box video-icon-extra-large position-relative">
                    </a>
                </div>
            </div>
            <div className="row row-cols-1 justify-content-center">
                <div className="col btn-dual text-center mt-3">
                    <a href="/" className="btn btn-box-shadow btn-large btn-round-edge d-table d-lg-inline-block lg-mb-15px md-mx-auto" style={{ backgroundColor: "#4ea8f6", color: "white" }}>Buy Now</a>
                </div>
            </div>
        </div>
    </section>
   );

}

export default HowWork;