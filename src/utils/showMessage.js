const showMessage = (title = '(⊙o⊙)？', duration = 1500) => {
    uni.showToast({
        title,
        duration,
        icon: 'none',
    })
}

export default showMessage