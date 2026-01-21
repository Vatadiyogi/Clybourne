const { APIURL } = process.env;

const buildDocumentUrls = async (order) => {
    if (order.documents && order.documents.length > 0) {
        return order.documents.map(doc => {
            const documentUrl = `${APIURL}/uploads/customer/${order.orderId}/${doc.filename}`;
            return {
                name: doc.name, // Assuming the document object contains a name
                url: documentUrl,
            };
        });
    }
    return [];
};

// Export the function correctly
module.exports = {
    buildDocumentUrls,
};
