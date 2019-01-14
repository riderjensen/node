const deleteProduct = (btn) => {
	console.log('clicked');
	const prodId = btn.parentNode.querySelector('[name=productId]').value;
	const csfr = btn.parentNode.querySelector('[name=_csrf]').value;

	const productElement = btn.closest('div');
	const productElementParent = productElement.closest('div');

	fetch('/admin/product/' + prodId, {
			method: 'DELETE',
			headers: {
				'csrf-token': csfr
			}
		}).then(result => {
			return result.json();
		}).then(data => {
			productElementParent.parentNode.removeChild(productElementParent);
		})
		.catch(err => {
			console.log(err);
		});
}