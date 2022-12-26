/**
 * 画面にステータスバーを表示するためのクラス
 *
 * @module Status
 */
export default class Status {
	#elemStatus;
	/**
	 * ステータスバーを ID で指定されるタグの中に挿入する。
	 * ID が指定されない場合は body の末尾に追加される。
	 *
	 * @param {string} [id] ステータスバーを挿入するタグの ID
	 */
	constructor(id) {
		const parentNode =
			id && document.getElementById(id) || document.body;
		const output = document.createElement('output');
		output.style.display = 'block';
		output.style.overflow = 'hidden';
		this.#elemStatus = parentNode.appendChild(output);
	}
	/**
	 * ステータスバーに表示される内容を追加する。
	 * 全ての引数は暗黙的に文字列に変換される。
	 *
	 * @param {...*} mesg ステータスバーの内容
	 */
	append(...mesg) {
		for (const str of mesg)
			this.#elemStatus.textContent += str;
	}
	/**
	 * ステータスバーの内容をクリアする。
	 */
	clear() {
		this.#elemStatus.textContent = '';
	}
	/**
	 * ステータスバーの内容を書き換える。
	 * 全ての引数の値は暗黙的に文字列に変換される。
	 *
	 * @param {...*} mesg ステータスバーの内容
	 */
	write(...mesg) {
		this.clear();
		this.append(...mesg);
	}
};
