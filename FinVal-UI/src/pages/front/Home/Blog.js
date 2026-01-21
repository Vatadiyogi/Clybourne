const Blog = () => {
  return (
    <section className="padding-60-60 bg-section-new">
      <div className="container">
        <div className="row justify-content-center mb-2 margin-8px">
          <div className="col-lg-7 text-center"
            data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 800, "delay": 0, "staggervalue": 200, "easing": "easeOutQuad" }'>
            <span className="fs-16 d-inline-block fw-500 text-uppercase  ls-1px" style={{ "color": "#787777" }}>Financial
              article</span>
            <h2 className="alt-font  fw-600 ls-minus-1px mb-0 text-base-color">Interesting <span
              style={{ "color": "#4ea8f6" }}>Blogs</span></h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12 ps-0 pe-0">
            <ul className="blog-side-image blog-wrapper row gx-4 ps-0 sm-ps-10px sm-pe-10px" style={{ position: 'relative' }}>
              <li className="col-lg-4 col-sm-6 mb-4">
                <div className="blog-box d-md-flex d-block flex-row h-100 border-radius-6px overflow-hidden box-shadow-extra-large">
                  <div className="blog-content w-100 h-350px sm-w-100 p-3 bg-white d-flex flex-column justify-content-center align-items-start last-paragraph-no-margin">
                    <a href="/blog-details" className="categories-btn bg-sky-blue text-white text-uppercase fw-500 mb-20px">
                      Business
                    </a>
                    <div className="heading-box-index">
                      <a href="/blog-details" className="d-inline-block alt-font text-base-color fw-600 fs-20 lh-28">
                        Creativity is nothing but a mind set free.
                      </a>
                    </div>
                    <p className="gray-text fs-16 lh-28">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                      industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text.
                    </p>
                    <div className="mt-15px">
                      <span style={{ height: '2px', width: '10px' }} className="separator bg-sky-blue"></span>
                      <a href="/blog-details" className="gray-text text-dark-gray-hover d-inline-block fs-12 fw-500 text-uppercase">
                        AUG 12,2024 | <span className="text-sky-blue">Fin-Valuation</span>
                      </a>
                    </div>
                  </div>
                </div>
              </li>
              <li className="col-lg-4 col-sm-6 mb-4">
                <div className="blog-box d-md-flex d-block flex-row h-100 border-radius-6px overflow-hidden box-shadow-extra-large">
                  <div className="blog-content w-100 h-350px sm-w-100 p-3 bg-white d-flex flex-column justify-content-center align-items-start last-paragraph-no-margin">
                    <a href="/blog-details" className="categories-btn bg-sky-blue text-white text-uppercase fw-500 mb-20px">
                      Finance
                    </a>
                    <div className="heading-box-index">
                      <a href="/blog-details" className="d-inline-block alt-font text-base-color fw-600 fs-20 lh-28">
                        A business needs a successful mix of design.
                      </a>
                    </div>
                    <p className="gray-text fs-16 lh-28">
                      Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                      classical Latin literature from 45 BC, making it over 2000 years old. Lorem Ipsum is not simply
                      random text.
                    </p>
                    <div className="mt-15px">
                      <span style={{ height: '2px', width: '10px' }} className="separator bg-sky-blue"></span>
                      <a href="/blog-details" className="gray-text text-dark-gray-hover d-inline-block fs-12 fw-500 text-uppercase">
                        AUG 11,2024 | <span className="text-sky-blue">Fin-Valuation</span>
                      </a>
                    </div>
                  </div>
                </div>
              </li>
              <li className="col-lg-4 col-sm-6 mb-4">
                <div className="blog-box d-md-flex d-block flex-row h-100 border-radius-6px overflow-hidden box-shadow-extra-large">
                  <div className="blog-content w-100 h-350px sm-w-100 p-3 bg-white d-flex flex-column justify-content-center align-items-start last-paragraph-no-margin">
                    <a href="/blog-details" className="categories-btn bg-sky-blue text-white text-uppercase fw-500 mb-20px">
                      Business
                    </a>
                    <div className="heading-box-index">
                      <a href="/blog-details" className="d-inline-block alt-font text-base-color fw-600 fs-20 lh-28">
                        A dream doesn't become reality through magic.
                      </a>
                    </div>
                    <p className="gray-text fs-16 lh-28">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                      industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text.
                    </p>
                    <div className="mt-15px">
                      <span style={{ height: '2px', width: '10px' }} className="separator bg-sky-blue"></span>
                      <a href="/blog-details" className="gray-text text-dark-gray-hover d-inline-block fs-12 fw-500 text-uppercase">
                        AUG 10,2024 | <span className="text-sky-blue">Fin-Valuation</span>
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Blog;