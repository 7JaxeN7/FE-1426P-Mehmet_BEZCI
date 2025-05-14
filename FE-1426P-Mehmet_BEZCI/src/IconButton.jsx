import { FaTrash } from 'react-icons/fa';

function IconButton({ onClick }) {
  return (
    <button
      className="btn btn-danger"
      style={{
        width: '40px',
        height: '40px',
        padding: 0,
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClick}
    >
      <FaTrash />
    </button>
  );
}

export default IconButton;
