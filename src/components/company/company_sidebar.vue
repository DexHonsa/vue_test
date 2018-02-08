<template>
<div>

  <div class="left-sub-sidebar">
    <div class="left-sub-sidebar-top">
      <div class="left-sub-sidebar-title">Companies
        <div onClick={this.toggleOptionDropdown.bind(this)} class="gear-btn dropdown-btn">
          <i class="fa fa-gear" />

          <!-- <div class="basic-dropdown gear-btn-dropdown animated-fast fadeInDown">
            <ul>
              <li onClick={this.showAddCompanyModal.bind(this)}>Add Company</li>
              <li class="divider" />
              <li>Settings</li>
            </ul>
          </div>  -->

        </div>
      </div>
      <div class="left-sub-sidebar-options">
        <div onClick="" class="add-project-btn dropdown-btn"><i class="fa fa-plus" />
          <!-- <div class="basic-dropdown add-project-btn-dropdown animated-fast fadeInDown">
            <ul>
              <li onClick={this.showAddCompanyModal.bind(this)}>Add Company</li>
            </ul>
          </div>  -->
        </div>
        <i class="fa fa-search" />
      </div>
    </div>
    <div class="left-sub-sidebar-item-container">
      
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'CompanySidebar'
}
</script>
