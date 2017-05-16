class ReduxFetch {

    deleteById(url, id, err, done) {
        fetch(url + "/" + id, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.status == 401) {
                window.location = '/login';
            }

            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }).then(done).catch(err);
    }

    post(url, body, err, done) {
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then((response) => {
            if (response.status == 401) {
                window.location = '/login';
            }
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }).then(done).catch(err);
    }

    put(url, body, err, done) {
        fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then((response) => {
            if (response.status == 401) {
                window.location = '/login';
            }
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }).then(done).catch(err);
    }

    fetchAll(url, err, done) {
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((response) => {

                if (response.status == 401) {
                    window.location = '/login';
                }

                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .then((response) => response.json())
            .then(done)
            .catch(err);
    }

    fetchById(url, id, err, done) {
        this.fetchAll(url + "/" + id, err, done);
    }
}
export const settingsUrl = '/api/settings';
export const mealsUrl = '/api/meals';
export const mealsAdminUrl = '/api/admin/meals';
export const rolesUrl = '/roles';
export const reduxFetch = new ReduxFetch();
