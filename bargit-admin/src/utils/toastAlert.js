import toast from 'react-hot-toast';

export const customAlert = (message, type = 'success') => {
    if (type === 'success') {
        toast.success(message, {
            style: {
                borderRadius: '10px',
                background: '#10b981', 
                color: '#fff',
            },
        });
    } else if (type === 'error') {
        toast.error(message, {
            style: {
                borderRadius: '10px',
                background: '#ef4444', 
                color: '#fff',
            },
        });
    } else if (type === 'loading') {
        toast.loading(message);
    } else {
        // Normal message
        toast(message, {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    }
};

// Agar direct methods use karne hain (Optional)
export const dismissToast = () => toast.dismiss();