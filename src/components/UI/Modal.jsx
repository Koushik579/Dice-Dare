import { useEffect } from "react";
import "./Modal.css";

const Modal = ({
  children,
  isOpen = false,
  onClose,
  title,
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = "",
}) => {
  useEffect(() => {
    if (!isOpen || !closeOnEscape) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (
      closeOnOverlay &&
      event.target === event.currentTarget
    ) {
      onClose?.();
    }
  };

  return (
    <div
      className="game-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={
        title ? "game-modal-title" : undefined
      }
      onMouseDown={handleOverlayClick}
    >
      <div
        className={[
          "game-modal__content",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {(title || showCloseButton) && (
          <div className="game-modal__header">
            {title && (
              <h2
                id="game-modal-title"
                className="game-modal__title"
              >
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                type="button"
                className="game-modal__close"
                onClick={onClose}
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
        )}

        <div className="game-modal__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;