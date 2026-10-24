import { CloseIcon } from "./Icons";

export default function Modal({ title, onClose, children }) {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            {/* stopPropagation: clicking inside the box must not close it */}
            <div className="modal" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
                        <CloseIcon />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}