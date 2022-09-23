import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import MediaQuery from 'react-responsive';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'clipcc-vm';
import Renderer from 'clipcc-render';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import StageWrapper from '../../containers/stage-wrapper.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';
import CostumeLibrary from '../../containers/costume-library.jsx';
import BackdropLibrary from '../../containers/backdrop-library.jsx';
import Watermark from '../../containers/watermark.jsx';

import Backpack from '../../containers/backpack.jsx';
import WebGlModal from '../../containers/webgl-modal.jsx';
import TipsLibrary from '../../containers/tips-library.jsx';
import Cards from '../../containers/cards.jsx';
import Alerts from '../../containers/alerts.jsx';
import DragLayer from '../../containers/drag-layer.jsx';
import ConnectionModal from '../../containers/connection-modal.jsx';
import TelemetryModal from '../telemetry-modal/telemetry-modal.jsx';
import SettingsModal from '../../containers/settings-modal.jsx';
import AboutModal from '../about-modal/about-modal.jsx';
import LoadErrorModal from '../../containers/load-error-modal.jsx';
import ContributorModal from '../contributor-modal/contributor-modal.jsx';

import layout, {STAGE_SIZE_MODES} from '../../lib/layout-constants';
import {resolveStageSize} from '../../lib/screen-utils';

import styles from './gui.css';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import soundsIcon from './icon--sounds.svg';

const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

// Cache this value to only retrieve it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = props => {
    const {
        aboutModalVisible,
        accountNavOpen,
        activeTabIndex,
        alertsVisible,
        authorId,
        authorThumbnailUrl,
        authorUsername,
        basePath,
        backdropLibraryVisible,
        backpackHost,
        backpackVisible,
        blocksTabVisible,
        cardsVisible,
        canChangeLanguage,
        canCreateNew,
        canEditTitle,
        canManageFiles,
        canRemix,
        canSave,
        canCreateCopy,
        canShare,
        canUseCloud,
        children,
        connectionModalVisible,
        costumeLibraryVisible,
        costumesTabVisible,
        contributorModalVisible,
        enableCommunity,
        intl,
        isCreating,
        isFullScreen,
        isPlayerOnly,
        isRtl,
        isShared,
        isStandalone,
        isTelemetryEnabled,
        loadErrorModalVisible,
        loading,
        logo,
        renderLogin,
        onClickAbout,
        onClickAccountNav,
        onCloseAccountNav,
        onLogOut,
        onOpenRegistration,
        onToggleLoginOpen,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        onBlocksLoad,
        onClickLogo,
        onExtensionButtonClick,
        onProjectTelemetryEvent,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        onRequestCloseTelemetryModal,
        onRequestCloseSettingsModal,
        onRequestCloseAboutModal,
        onRequestCloseLoadErrorModal,
        onRequestCloseContributorModal,
        onSeeCommunity,
        onShare,
        onShowPrivacyPolicy,
        onStartSelectingFileUpload,
        onTelemetryModalCancel,
        onTelemetryModalOptIn,
        onTelemetryModalOptOut,
        showComingSoon,
        soundsTabVisible,
        stageSizeMode,
        targetIsStage,
        telemetryModalVisible,
        settingsVisible,
        tipsLibraryVisible,
        layoutStyle,
        vm,
        stageWidth,
        stageHeight,
        ...componentProps
    } = omit(props, 'dispatch');
    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }

    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }
    return (<MediaQuery minWidth={layout.fullSizeMinWidth}>{isFullSize => {
        const stageSize = resolveStageSize(stageSizeMode, isFullSize);
        const guiContent = [
            <Box
                key="workspace"
                className={styles.editorWrapper}
            >
                <Tabs
                    forceRenderTabPanel
                    className={tabClassNames.tabs}
                    selectedIndex={activeTabIndex}
                    selectedTabClassName={tabClassNames.tabSelected}
                    selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                    onSelect={onActivateTab}
                >
                    <TabList className={tabClassNames.tabList}>
                        <Tab className={tabClassNames.tab}>
                            <img
                                draggable={false}
                                src={codeIcon}
                            />
                            <FormattedMessage
                                defaultMessage="Code"
                                description="Button to get to the code panel"
                                id="gui.gui.codeTab"
                            />
                        </Tab>
                        <Tab
                            className={tabClassNames.tab}
                            onClick={onActivateCostumesTab}
                        >
                            <img
                                draggable={false}
                                src={costumesIcon}
                            />
                            {targetIsStage ? (
                                <FormattedMessage
                                    defaultMessage="Backdrops"
                                    description="Button to get to the backdrops panel"
                                    id="gui.gui.backdropsTab"
                                />
                            ) : (
                                <FormattedMessage
                                    defaultMessage="Costumes"
                                    description="Button to get to the costumes panel"
                                    id="gui.gui.costumesTab"
                                />
                            )}
                        </Tab>
                        <Tab
                            className={tabClassNames.tab}
                            onClick={onActivateSoundsTab}
                        >
                            <img
                                draggable={false}
                                src={soundsIcon}
                            />
                            <FormattedMessage
                                defaultMessage="Sounds"
                                description="Button to get to the sounds panel"
                                id="gui.gui.soundsTab"
                            />
                        </Tab>
                    </TabList>
                    <TabPanel className={tabClassNames.tabPanel}>
                        <Box className={styles.blocksWrapper}>
                            <Blocks
                                layoutStyle={layoutStyle}
                                canUseCloud={canUseCloud}
                                grow={1}
                                isVisible={blocksTabVisible}
                                options={{
                                    media: `${basePath}static/blocks-media/`
                                }}
                                stageSize={stageSize}
                                onLoad={onBlocksLoad}
                                vm={vm}
                            />
                        </Box>
                        <Box className={styles.extensionButtonContainer}>
                            <button
                                className={styles.extensionButton}
                                title={intl.formatMessage(messages.addExtension)}
                                onClick={onExtensionButtonClick}
                            >
                                <img
                                    className={styles.extensionButtonIcon}
                                    draggable={false}
                                    src={addExtensionIcon}
                                />
                            </button>
                        </Box>
                        <Box className={styles.watermark}>
                            <Watermark />
                        </Box>
                    </TabPanel>
                    <TabPanel className={tabClassNames.tabPanel}>
                        {costumesTabVisible ? <CostumeTab vm={vm} /> : null}
                    </TabPanel>
                    <TabPanel className={tabClassNames.tabPanel}>
                        {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                    </TabPanel>
                </Tabs>
                {backpackVisible ? (
                    <Backpack host={backpackHost} />
                ) : null}
            </Box>,
            <Box
                key="stage"
                className={classNames(styles.stageAndTargetWrapper, styles[stageSize])}
            >
                <StageWrapper
                    layoutStyle={layoutStyle}
                    isRendererSupported={isRendererSupported}
                    isRtl={isRtl}
                    stageSize={stageSize}
                    vm={vm}
                    stageWidth={stageWidth}
                    stageHeight={stageHeight}
                />
                <Box className={styles.targetWrapper}>
                    <TargetPane
                        stageSize={stageSize}
                        layoutStyle={layoutStyle}
                        vm={vm}
                    />
                </Box>
            </Box>
        ];
        return isPlayerOnly ? (
            <StageWrapper
                canSave={canSave}
                authorUsername={authorUsername}
                isFullScreen={isFullScreen}
                isRendererSupported={isRendererSupported}
                isRtl={isRtl}
                loading={loading}
                stageSize={STAGE_SIZE_MODES.large}
                vm={vm}
                stageWidth={stageWidth}
                stageHeight={stageHeight}
            >
                {alertsVisible ? (
                    <Alerts className={styles.alertsContainer} />
                ) : null}
            </StageWrapper>
        ) : (
            <Box
                className={styles.pageWrapper}
                dir={isRtl ? 'rtl' : 'ltr'}
                {...componentProps}
            >
                {loading ? (
                    <Loader />
                ) : null}
                {isCreating ? (
                    <Loader messageId="gui.loader.creating" />
                ) : null}
                {isRendererSupported ? null : (
                    <WebGlModal isRtl={isRtl} />
                )}
                {tipsLibraryVisible ? (
                    <TipsLibrary />
                ) : null}
                {cardsVisible ? (
                    <Cards />
                ) : null}
                {alertsVisible ? (
                    <Alerts className={styles.alertsContainer} />
                ) : null}
                {loadErrorModalVisible ? (
                    <LoadErrorModal
                        onRequestClose={onRequestCloseLoadErrorModal}
                    />
                ) : null}
                {connectionModalVisible ? (
                    <ConnectionModal
                        vm={vm}
                    />
                ) : null}
                {costumeLibraryVisible ? (
                    <CostumeLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseCostumeLibrary}
                    />
                ) : null}
                {backdropLibraryVisible ? (
                    <BackdropLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseBackdropLibrary}
                    />
                ) : null}
                {settingsVisible ? (
                    <SettingsModal
                        onRequestClose={onRequestCloseSettingsModal}
                    />
                ) : null}
                {aboutModalVisible ? (
                    <AboutModal
                        onRequestClose={onRequestCloseAboutModal}
                    />
                ) : null}
                {contributorModalVisible ? (
                    <ContributorModal
                        onRequestClose={onRequestCloseContributorModal}
                    />
                ) : null}

                <MenuBar
                    accountNavOpen={accountNavOpen}
                    authorId={authorId}
                    authorThumbnailUrl={authorThumbnailUrl}
                    authorUsername={authorUsername}
                    canChangeLanguage={canChangeLanguage}
                    canCreateCopy={canCreateCopy}
                    canCreateNew={canCreateNew}
                    canEditTitle={canEditTitle}
                    canManageFiles={canManageFiles}
                    canRemix={canRemix}
                    canSave={canSave}
                    canShare={canShare}
                    className={styles.menuBarPosition}
                    enableCommunity={enableCommunity}
                    isShared={isShared}
                    isStandalone={isStandalone}
                    logo={logo}
                    renderLogin={renderLogin}
                    showComingSoon={showComingSoon}
                    onClickAbout={onClickAbout}
                    onClickAccountNav={onClickAccountNav}
                    onClickLogo={onClickLogo}
                    onCloseAccountNav={onCloseAccountNav}
                    onLogOut={onLogOut}
                    onOpenRegistration={onOpenRegistration}
                    onProjectTelemetryEvent={onProjectTelemetryEvent}
                    onSeeCommunity={onSeeCommunity}
                    onShare={onShare}
                    onStartSelectingFileUpload={onStartSelectingFileUpload}
                    onToggleLoginOpen={onToggleLoginOpen}
                />
                <Box className={styles.bodyWrapper}>
                    <Box className={styles.flexWrapper}>
                        {layoutStyle === 'scratch2' ? guiContent.reverse() : guiContent}
                    </Box>
                </Box>
                <DragLayer />
            </Box>
        );
    }}</MediaQuery>);
};

GUIComponent.propTypes = {
    aboutModalVisible: PropTypes.bool,
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    backdropLibraryVisible: PropTypes.bool,
    backpackHost: PropTypes.string,
    backpackVisible: PropTypes.bool,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    canChangeLanguage: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    contributorModalVisible: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    isCreating: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    loadErrorModalVisible: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onBlocksLoad: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickLogo: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onRequestCloseSettingsModal: PropTypes.func,
    onRequestCloseAboutModal: PropTypes.func,
    onRequestCloseLoadErrorModal: PropTypes.func,
    onRequestCloseContributorModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onShowPrivacyPolicy: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onTabSelect: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    renderLogin: PropTypes.func,
    settingsVisible: PropTypes.bool,
    showComingSoon: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    telemetryModalVisible: PropTypes.bool,
    tipsLibraryVisible: PropTypes.bool,
    layoutStyle: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired
};
GUIComponent.defaultProps = {
    backpackHost: null,
    backpackVisible: false,
    basePath: './',
    canChangeLanguage: true,
    canCreateNew: false,
    canEditTitle: false,
    canManageFiles: true,
    canRemix: false,
    canSave: false,
    canCreateCopy: false,
    canShare: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    loading: false,
    showComingSoon: false,
    layoutStyle: 'scratch3',
    stageSizeMode: STAGE_SIZE_MODES.large
};

const mapStateToProps = state => ({
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    stageWidth: state.scratchGui.customStageSize.width,
    stageHeight: state.scratchGui.customStageSize.height,
});

export default injectIntl(connect(
    mapStateToProps
)(GUIComponent));
