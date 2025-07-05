import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-28 left-6 z-50 text-yellow-400 hover:text-yellow-500 transition-colors duration-200 flex items-center gap-2"
    >
      <FiArrowLeft className="w-6 h-6" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
