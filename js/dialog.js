/**
 * 画面にダイアログを表示するためのクラス
 *
 * @module Dialog
 */
export default class Dialog {
	#elemDialog;
	/**
	 * ダイアログの結果などを格納するための変数（愚か）
	 * @public
	 * @type {*}
	 */
	status;
	/**
	 * ダイアログを ID で指定されるタグの中に挿入する。
	 * ID が指定されない場合は body の末尾に追加される。
	 *
	 * @param {string} [id] ダイアログを挿入するタグの ID
	 */
	constructor(id) {
		const parentNode =
			id && document.getElementById(id) || document.body;
		const dialog = document.createElement('dialog');
		this.#elemDialog = parentNode.appendChild(dialog);
	}
	/**
	 * 開かれているダイアログを閉じる。
	 * 既に閉じられている時は何もしない
	 */
	close() {
		this.#elemDialog.close();
	}
	/**
	 * ダイアログの内容を設定する。
	 * Element を指定した場合はそれがそのまま利用される。
	 * String を指定した場合はそれを HTML として解釈して利用される。
	 *
	 * @type {Element|String}
	 */
	set content(cnt) {
		this.reset();
		const parser = new DOMParser();
		const child = cnt instanceof Node ? cnt
			: parser.parseFromString(cnt, 'text/html')
				.body.firstElementChild;
		this.#elemDialog.appendChild(child);
	}
	/**
	 * ダイアログを開く。
	 *
	 * @param {boolean} [modal] モーダルダイアログなら真
	 * @param {Element|String} [cnt] ダイアログの内容
	 */
	open(modal, cnt) {
		if (cnt)
			this.content = cnt;
		this.#elemDialog[modal ? 'showModal' : 'show']();
	}
	/**
	 * ダイアログが開かれているか調べる。
	 *
	 * @type {bool}
	 */
	get opened() {
		return this.#elemDialog.open;
	}
	/**
	 * ダイアログをリセットする。
	 * ダイアログを開いているときに呼ばないこと。
	 */
	reset() {
		const clone = this.#elemDialog.cloneNode(false);
		const parent = this.#elemDialog.parentNode;
		parent.replaceChild(clone, this.#elemDialog);
		this.#elemDialog = clone;
	}
	/**
	 * ダイアログをモードレスで表示する。
	 */
	show() {
		this.#elemDialog.show();
	}
	/**
	 * ダイアログをモーダルで表示する。
	 */
	showModal() {
		this.#elemDialog.showModal();
	}
};
