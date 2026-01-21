const GraphHeading = ({data, finData, valueType}) => {
  return (
    <span className="fst-italic fw-500 fs-12 ms-1">({data.currency} {valueType})</span>
  )
}

export default GraphHeading;