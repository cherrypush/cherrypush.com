# frozen_string_literal: true

RailsAdmin.config do |config|
  config.asset_source = :sprockets

  config.parent_controller = '::ApplicationController'
  config.authorize_with { require_admin }

  ## == PaperTrail ==
  # config.audit_with :paper_trail, 'User', 'PaperTrail::Version' # PaperTrail >= 3.0.0

  ### More at https://github.com/railsadminteam/rails_admin/wiki/Base-configuration

  ## == Gravatar integration ==
  ## To disable Gravatar integration in Navigation Bar set to false
  # config.show_gravatar = true

  config.actions do
    dashboard do # mandatory
      statistics false
    end
    index # mandatory
    new
    export
    bulk_delete
    show
    edit
    delete
    show_in_app

    ## With an audit adapter, you can add:
    # history_index
    # history_show
  end

  config.model Project do
    exclude_fields :reports
  end

  config.model Report do
    exclude_fields :occurrences
  end
end
