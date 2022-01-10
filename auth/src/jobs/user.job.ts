import User from '../models/User.model';

export const unlockAccount = async (user: any) => {

    console.log('started running user-job to unlock user account every 5 minute');

    const _user = await User.findById(user._id);

    if(_user && _user.isLocked){

        console.log('user account is already locked. trying to determine when to unlock it.');
        
        _user.isLocked = false;
        _user.loginLimit = 0;

        await _user.save();

        console.log('user-job: user account unlocked')


    }else {

        console.log('user account is not locked yet');
    }

}
