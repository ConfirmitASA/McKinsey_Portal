<div class="cavani_tm_section" id="companies">
    <div class="cavani_tm_companies">
        <div class="content">
            <div class="page-block">
                <div class="action-button round-button add-item-button" id="add-company-button">
                    +
                </div>

                <h2>Companies</h2>

                <div id="edit-company-form"
                    style="filter: drop-shadow(0 0 10px #999); display: none; background-color: white; border: 1px solid #c0c0c0; padding: 20px 40px; margin: 40px 0px; padding-bottom: 70px;">
                    <h4 style="margin-bottom: 20px">Edit Company info</h4>

                    <input type="hidden" id="edit-company-companyid" />
                    <input class="session-input edit-input" placeholder="company name" type="text" id="edit-company-name"
                        style="display: inline-block; width: 250px" />
                    <br />
                    <input class="session-input edit-input" placeholder="support email" type="text" id="edit-company-supportemail"
                        style="display: inline-block; width: 250px" />
                    <br />
                    <br>
                    <h4 style="margin-bottom: 20px">Company logo URL</h4>
                    <div style="display: flex;">
                        <input class="session-input edit-input" placeholder="logo URL" type="text" id="edit-company-logo" style="display: inline-block; width: 250px">
                        <button class="action-button" id="preview-logo_button" type="button" style="margin-left: 10px; height: 42px; float: left;">Preview</button>
                        <button class="action-button" id="reset-logo_button" type="button" style="margin-left: 10px; height: 42px; float: left;">Reset logo</button>
                    </div>
                    <div id=file-upload_container></div>
                    <div class="form-element__multi-option-container">
                        <input type="checkbox" id="use-logo-in-email"><label for="use-logo-in-email">Use logo in email template</label>
                    </div>
                    <p>Please enter direct link to  jpeg, jpg, gif, png or svg file</p>
                    <p>We recommend to use transparent horizontal-oriented images</p>
                    <br>
                    <div class="logo-preview_container">
                        <div class="logo-preview-dark">
                            <div style="height: 100px; padding: 15px; display: flex; align-items: center;">
                                <img src="./assets/images/McKinsey-dark.png" class="logo-preview">
                            </div>
                        </div>
                        <div class="logo-preview-light">
                            <div style="height: 100px; padding: 15px; display: flex; align-items: center;">
                                <img src="./assets/images/McKinsey-light.png" class="logo-preview">
                            </div>
                        </div>
                    </div>
                    <br>
                    <button class="action-button" id="edit-company-save-button" type="button"
                        style="height: 42px; float: left;">
                        Save
                    </button>
                    <button class="action-button" id="edit-company-cancel-button" type="button"
                        style="height: 42px; margin-left: 20px">
                        Cancel
                    </button>
                </div>

                <div id="company-list" style="margin: 40px 0px;">
                    <div class="item-list" id="system-companies">
                        Loading ...
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>