import React from 'react';
import { toast } from "sonner";

const ImageUploader = ({ images, setImages, coverIndex, setCoverIndex, isBucketReady }) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      toast.error('Você pode fazer upload de no máximo 6 imagens.');
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
    if (coverIndex === fromIndex) setCoverIndex(toIndex);
    else if (coverIndex === toIndex) setCoverIndex(fromIndex);
  };

  const setCoverImage = (index) => {
    setCoverIndex(index);
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-2">Imagens devem ser 1200x1200 pixels, formato JPG ou PNG</p>
      <input 
        type="file" 
        onChange={handleImageUpload} 
        multiple 
        accept="image/*" 
        className="mb-2"
        disabled={!isBucketReady}
      />
      {!isBucketReady && (
        <p className="text-sm text-yellow-600">Aguarde, preparando sistema de armazenamento...</p>
      )}
      {images.map((image, index) => (
        <div key={index} className="relative">
          <img src={URL.createObjectURL(image)} alt={`Produto ${index + 1}`} className="w-20 h-20 object-cover rounded" />
          {index === coverIndex && (
            <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">
              Capa
            </span>
          )}
          <button 
            type="button" 
            onClick={() => setCoverImage(index)} 
            className="absolute bottom-0 left-0 bg-gray-800 text-white text-xs px-1 rounded-tr"
          >
            {index === coverIndex ? 'Capa' : 'Definir Capa'}
          </button>
          {index > 0 && (
            <button 
              type="button" 
              onClick={() => moveImage(index, index - 1)} 
              className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-1 rounded-tl"
            >
              ←
            </button>
          )}
          {index < images.length - 1 && (
            <button 
              type="button" 
              onClick={() => moveImage(index, index + 1)} 
              className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-1 rounded-bl"
            >
              →
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageUploader;