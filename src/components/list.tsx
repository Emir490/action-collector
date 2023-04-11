import useActions from '@/hooks/useActions';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

const List = () => {
    const { actions, getActions } = useActions();
    console.log(actions);

    const router = useRouter();
    const action = router.query.action;

    useEffect(() => {
        if (action && !Array.isArray(action)) {
            getActions(action);
        }
    }, [])

  return (
    <div>
        <div>
            {actions.map(action => (
                <video src={`${action.video}`} controls></video>
            ))}
        </div>
    </div>
  )
}

export default List