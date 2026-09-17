// utils/refreshResource.js
import axios from "axios";

/**
 * Fetches fresh data for a resource by id and hands it to a setter.
 * Works for any Inertia/Laravel `show` route that returns JSON.
 *
 * @param {Object} options
 * @param {string} options.routeName   - e.g. "procurement.show"
 * @param {string|number} options.id   - the resource id to fetch
 * @param {Function} options.onSuccess - called with response.data on success
 * @param {Function} [options.onError] - optional custom error handler
 * @param {string} [options.label]     - optional label for console logging
 */
export async function refreshResource({
    routeName,
    id,
    onSuccess,
    onError,
    label = routeName,
}) {
    if (!id) {
        console.warn(`[refreshResource:${label}] skipped — no id provided`);
        return null;
    }

    try {
        const response = await axios.get(route(routeName, id));
        console.log(`[refreshResource:${label}] fetched`, response.data);
        onSuccess?.(response.data);
        return response.data;
    } catch (error) {
        console.error(`[refreshResource:${label}] failed`, error);
        onError?.(error);
        return null;
    }
}
