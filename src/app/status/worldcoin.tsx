"use client";
export type WorldcoinProps = {
}
export default function Worldcoin({}: WorldcoinProps) {
return (<>
{/* スペースを３０空ける */}
    <div className="h-20"></div>
    <h1 className="text-center">あなたのもらえる金額</h1>
    <h1 className="text-center">1WLD</h1>
    <div className="text-center py-4">
    <button id="openButton">モーダルを開く</button>
    <dialog id="modalDialog" className="dialog">
    <div id="dialog-container">
        <header>
            <span>Header</span>
            <button id="closeButton" type="button">
                <p>閉じる</p>
            </button>
        </header>
        <div>Message</div>
        <form method="dialog">
            <button type="submit" value="OK">Ok</button>
            <button type="submit" value="CANCEL">Cancel</button>
        </form>
    </div>
    </dialog>
    </div>
</>);
}
