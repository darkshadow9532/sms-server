let handle = 0;
const handleStorage = new Map();

exports.setVaryingInterval = (fn, delay) => {
    //Save the handle for this instance of varyingInterval
    const savedHandle = handle++;
    //This function delays the execution of user code and calls itself repeatedly
    const schedule = () => {
        const newTimeoutHandle = setTimeout(() => {
            //Execute the user code
            fn();
            //Repeat
            schedule();
        }, delay())
        //Update the timeout handle associated with our custom handle
        handleStorage.set(savedHandle, newTimeoutHandle);
    };

    //Start the loop
    schedule();
    //Allow the user to stop the loop by providing a handle
    return savedHandle;
};

exports.clearVaryingInterval = (handle) => {
    //Find the timeout handle associated with our custom handle
    const timeoutHandle = handleStorage.get(handle);
    //Cancel the scheduled execution
    clearTimeout(timeoutHandle);
    //Forget about the interval
    handleStorage.delete(handle);
};