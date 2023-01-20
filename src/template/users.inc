<div class="cavani_tm_section" id="users">
    <div class="cavani_tm_users">
        <div class="content">
            <div class="page-block">
                <div class="action-button round-button add-item-button" id="add-user-button">
                    +
                </div>

                <h2>Users</h2>
                <div id="edit-user-form"
                    style="filter: drop-shadow(0 0 10px #999); display: none; background-color: white; border: 1px solid #c0c0c0; padding: 20px 40px; margin: 40px 0px; padding-bottom: 70px;">
                    <h4 style="margin-bottom: 20px">Edit User</h4>
                    <input type="hidden" id="edit-user-userid" />

                    <input class="session-input edit-input" placeholder="username" type="text" id="edit-user-useridedit"
                        style="display: inline-block; width: 250px" />
                    <br />
                    <input class="session-input edit-input" placeholder="full name" type="text" id="edit-user-name"
                        style="display: inline-block; width: 250px" />
                    <br />
                    <input class="session-input edit-input" placeholder="email"
                        style="display: inline-block; width: 250px; margin-bottom: 20px;" type="text"
                        id="edit-user-email" />
                    <br />
                    <input class="session-input edit-input" placeholder="password"
                        style="display: inline-block; width: 250px; margin-bottom: 20px;" type="password"
                        id="edit-user-password" />
                    <br />

                    <div class="form-element__dropdown-container">
                        <span>Status:</span>
                        <select placeholder="user state" id="edit-user-userstate">
                            <option value="1">Pending approval</option>
                            <option value="2">Active</option>
                            <option value="3">No longer active</option>
                        </select>
                    </div>

                    <div class="form-element__multi-option-container">
                        <input type="checkbox" id="edit-user-roles-admin" ><label for="edit-user-roles-admin">Administrator</label>
                    </div>

                    <div class="form-element__dropdown-container">
                        <span>Company:</span>
                        <select placeholder="user company" id="edit-user-company">
                            <option value="" disabled selected>Select Company</option>
                        </select>
                    </div>

                    <p>
                        (The value entered by the user during registration was '<span
                            id="edit-user-self-company"></span>')
                    </p>

                    <br />
                    <button class="action-button" id="edit-user-save-button" type="button"
                        style="height: 42px; float: left;">
                        Save
                    </button>
                    <button class="action-button" id="edit-user-cancel-button" type="button"
                        style="height: 42px; margin-left: 20px">
                        Cancel
                    </button>
                </div>

                <div id="user-list" style="margin: 40px 0px;">
                    <div class="item-list" id="system-users">
                        Loading ...
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>